using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;

// One-off tool: removes the pure-black render background around box art mockups.
// Flood-fills from the borders, erodes the dark fringe, and feathers the edge.
public static class BgCleaner {
    public static string Process(string path, int erodePasses) {
        Bitmap orig = new Bitmap(path);
        int w = orig.Width, h = orig.Height;
        Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp)) { g.DrawImageUnscaled(orig, 0, 0); }
        orig.Dispose();
        Rectangle rect = new Rectangle(0, 0, w, h);
        BitmapData d = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = d.Stride;
        byte[] px = new byte[stride * h];
        System.Runtime.InteropServices.Marshal.Copy(d.Scan0, px, 0, px.Length);

        bool[] bg = new bool[w * h];
        Queue<int> q = new Queue<int>();
        Action<int, int> tryEnq = (x, y) => {
            if (x < 0 || y < 0 || x >= w || y >= h) return;
            int idx = y * w + x;
            if (bg[idx]) return;
            int o = y * stride + x * 4;
            if (px[o] <= 4 && px[o + 1] <= 4 && px[o + 2] <= 4) { bg[idx] = true; q.Enqueue(idx); }
        };
        for (int x = 0; x < w; x++) { tryEnq(x, 0); tryEnq(x, h - 1); }
        for (int y = 0; y < h; y++) { tryEnq(0, y); tryEnq(w - 1, y); }
        while (q.Count > 0) { int idx = q.Dequeue(); int y = idx / w, x = idx % w; tryEnq(x + 1, y); tryEnq(x - 1, y); tryEnq(x, y + 1); tryEnq(x, y - 1); }

        for (int pass = 0; pass < erodePasses; pass++) {
            List<int> add = new List<int>();
            for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
                int idx = y * w + x;
                if (bg[idx]) continue;
                if ((x > 0 && bg[idx - 1]) || (x < w - 1 && bg[idx + 1]) || (y > 0 && bg[idx - w]) || (y < h - 1 && bg[idx + w])) add.Add(idx);
            }
            foreach (int idx in add) bg[idx] = true;
        }

        for (int i = 0; i < w * h; i++) if (bg[i]) { int o = (i / w) * stride + (i % w) * 4; px[o + 3] = 0; }
        byte[] alpha = new byte[w * h];
        for (int i = 0; i < w * h; i++) alpha[i] = bg[i] ? (byte)0 : (byte)255;
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            int idx = y * w + x;
            if (alpha[idx] != 255) continue;
            bool edge = (x > 0 && alpha[idx - 1] == 0) || (x < w - 1 && alpha[idx + 1] == 0) || (y > 0 && alpha[idx - w] == 0) || (y < h - 1 && alpha[idx + w] == 0);
            if (edge) { int o = y * stride + x * 4; px[o + 3] = 140; }
        }

        System.Runtime.InteropServices.Marshal.Copy(px, 0, d.Scan0, px.Length);
        bmp.UnlockBits(d);
        string tmp = path + ".tmp.png";
        bmp.Save(tmp, ImageFormat.Png);
        bmp.Dispose();
        System.IO.File.Delete(path);
        System.IO.File.Move(tmp, path);
        return "ok";
    }
}
