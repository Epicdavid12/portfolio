"""Downsample the SiteScape retro game room point cloud (12M pts, 328MB)
into a compact quantized binary the website can stream (~7MB).

Output format (room.bin):
  positions: int16 x,y,z per point (quantized over bbox)
  colors:    uint8 r,g,b per point
Metadata (bbox, count) goes to room.json.
"""
import json
import struct
import numpy as np
from pathlib import Path

SRC = Path(r"c:\Users\dglaz\OneDrive\Desktop\Portfolio\Site files\retro_game_room_sitescape")
OUT = Path(r"c:\Users\dglaz\OneDrive\Desktop\Portfolio\website\media")
TARGET_POINTS = 1_100_000

gltf = json.loads((SRC / "scene.gltf").read_text(encoding="utf-8"))
bin_data = (SRC / "scene.bin").read_bytes()

COMP_DTYPE = {5120: np.int8, 5121: np.uint8, 5122: np.int16,
              5123: np.uint16, 5125: np.uint32, 5126: np.float32}
TYPE_SIZE = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def read_accessor(idx):
    acc = gltf["accessors"][idx]
    bv = gltf["bufferViews"][acc["bufferView"]]
    dtype = COMP_DTYPE[acc["componentType"]]
    ncomp = TYPE_SIZE[acc["type"]]
    offset = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    count = acc["count"]
    arr = np.frombuffer(bin_data, dtype=dtype, count=count * ncomp, offset=offset)
    return arr.reshape(count, ncomp)


def node_matrix(node):
    if "matrix" in node:
        return np.array(node["matrix"], dtype=np.float64).reshape(4, 4).T
    m = np.eye(4)
    # TRS not used in this file, but handle anyway
    if "translation" in node:
        t = np.eye(4); t[:3, 3] = node["translation"]; m = m @ t
    return m


# Walk node tree, collect (mesh_index, world_matrix)
mesh_instances = []

def walk(node_idx, parent_m):
    node = gltf["nodes"][node_idx]
    m = parent_m @ node_matrix(node)
    if "mesh" in node:
        mesh_instances.append((node["mesh"], m))
    for c in node.get("children", []):
        walk(c, m)

for root in gltf["scenes"][gltf.get("scene", 0)]["nodes"]:
    walk(root, np.eye(4))

print(f"mesh instances: {len(mesh_instances)}")

total = sum(gltf["accessors"][gltf["meshes"][mi]["primitives"][0]["attributes"]["POSITION"]]["count"]
            for mi, _ in mesh_instances)
keep_ratio = min(1.0, TARGET_POINTS / total)
print(f"total points: {total}, keep ratio: {keep_ratio:.4f}")

rng = np.random.default_rng(42)
pos_parts, col_parts = [], []

for mi, m in mesh_instances:
    prim = gltf["meshes"][mi]["primitives"][0]
    pos = read_accessor(prim["attributes"]["POSITION"]).astype(np.float64)
    col = read_accessor(prim["attributes"]["COLOR_0"])
    n = len(pos)
    k = max(1, int(n * keep_ratio))
    sel = rng.choice(n, size=k, replace=False)
    p = pos[sel]
    # apply world matrix
    p = p @ m[:3, :3].T + m[:3, 3]
    c = col[sel][:, :3]  # drop alpha
    if c.dtype == np.float32 or c.dtype == np.float64:
        c = np.clip(c * 255.0, 0, 255).astype(np.uint8)
    pos_parts.append(p.astype(np.float32))
    col_parts.append(c)

P = np.concatenate(pos_parts)
C = np.concatenate(col_parts)
print(f"kept points: {len(P)}")

# ---- denoise: drop points in sparsely-occupied voxels (scan flyaways) ----
VOX = 0.08
key = np.floor(P / VOX).astype(np.int64)
# hash voxel coords
h = key[:, 0] * 73856093 ^ key[:, 1] * 19349663 ^ key[:, 2] * 83492791
uniq, inv, counts = np.unique(h, return_inverse=True, return_counts=True)
dense = counts[inv] >= 14
P, C = P[dense], C[dense]
print(f"after denoise: {len(P)}")

lo = P.min(axis=0)
hi = P.max(axis=0)
span = np.maximum(hi - lo, 1e-6)
Q = np.round((P - lo) / span * 65535.0 - 32768.0).astype(np.int16)

OUT.mkdir(parents=True, exist_ok=True)
with open(OUT / "room.bin", "wb") as f:
    f.write(Q.tobytes())
    f.write(C.tobytes())

meta = {
    "count": int(len(P)),
    "min": [float(v) for v in lo],
    "max": [float(v) for v in hi],
}
(OUT / "room.json").write_text(json.dumps(meta), encoding="utf-8")
print("wrote", OUT / "room.bin", (OUT / "room.bin").stat().st_size / 1e6, "MB")
print(meta)
