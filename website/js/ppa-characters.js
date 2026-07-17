/*
 * Political Party Animal   animated character sprites.
 *
 * Idle state: UseMe animation looping.
 * On click/tap: Clicked -> AddPop -> AddMoney -> Delete -> Spawn -> Idle (if the
 * character has one), then back to the looping UseMe.
 * Sheets are 10-column grids of 256x256 frames in img/anim/.
 */
(function () {
	var MANIFEST = {
		RichGuy: {
			UseMe:    { file: 'RichGuy_UseMe.png',    frames: 60,  cols: 10 },
			Clicked:  { file: 'RichGuy_Clicked.png',  frames: 60,  cols: 10 },
			AddPop:   { file: 'RichGuy_AddPop.png',   frames: 48,  cols: 10 },
			AddMoney: { file: 'RichGuy_AddMoney.png', frames: 48,  cols: 10 },
			Delete:   { file: 'RichGuy_Delete.png',   frames: 156, cols: 10 },
			Spawn:    { file: 'RichGuy_Spawn.png',    frames: 60,  cols: 10 }
		},
		Reporter: {
			UseMe:    { file: 'Reporter_UseMe.png',    frames: 60,  cols: 10 },
			Clicked:  { file: 'Reporter_Clicked.png',  frames: 60,  cols: 10 },
			AddPop:   { file: 'Reporter_AddPop.png',   frames: 60,  cols: 10 },
			AddMoney: { file: 'Reporter_AddMoney.png', frames: 60,  cols: 10 },
			Delete:   { file: 'Reporter_Delete.png',   frames: 120, cols: 10 },
			Spawn:    { file: 'Reporter_Spawn.png',    frames: 60,  cols: 10 },
			Idle:     { file: 'Reporter_Idle.png',     frames: 2,   cols: 2, fps: 3, repeats: 3 }
		},
		Extremist: {
			UseMe:    { file: 'Extremist_UseMe.png',    frames: 60,  cols: 10 },
			Clicked:  { file: 'Extremist_Clicked.png',  frames: 60,  cols: 10 },
			AddPop:   { file: 'Extremist_AddPop.png',   frames: 36,  cols: 10 },
			AddMoney: { file: 'Extremist_AddMoney.png', frames: 48,  cols: 10 },
			Delete:   { file: 'Extremist_Delete.png',   frames: 150, cols: 10 },
			Spawn:    { file: 'Extremist_Spawn.png',    frames: 60,  cols: 10 }
		},
		AverageVoter: {
			UseMe:    { file: 'AverageVoter_UseMe.png',    frames: 60,  cols: 10 },
			Clicked:  { file: 'AverageVoter_Clicked.png',  frames: 60,  cols: 10 },
			AddPop:   { file: 'AverageVoter_AddPop.png',   frames: 42,  cols: 10 },
			AddMoney: { file: 'AverageVoter_AddMoney.png', frames: 42,  cols: 10 },
			Delete:   { file: 'AverageVoter_Delete.png',   frames: 180, cols: 10 },
			Spawn:    { file: 'AverageVoter_Spawn.png',    frames: 60,  cols: 10 }
		}
	};

	var DEFAULT_FPS = 30;
	var CLICK_SEQUENCE = ['Clicked', 'AddPop', 'AddMoney', 'Delete', 'Spawn', 'Idle'];

	document.querySelectorAll('.ppa-sprite').forEach(initSprite);

	function initSprite(el) {
		var anims = MANIFEST[el.dataset.char];
		if (!anims) return;

		Object.keys(anims).forEach(function (name) {
			var img = new Image();
			img.src = 'img/anim/' + anims[name].file;
		});

		var queue = [];        // remaining one-shot animations after the current one
		var current = null;    // { anim, name, frame, repeatsLeft }
		var lastTick = 0;
		var acc = 0;

		function startAnim(name) {
			var anim = anims[name];
			current = {
				anim: anim,
				name: name,
				frame: 0,
				repeatsLeft: (anim.repeats || 1) - 1
			};
			var rows = Math.ceil(anim.frames / anim.cols);
			el.style.backgroundImage = 'url("img/anim/' + anim.file + '")';
			el.style.backgroundSize = (anim.cols * 100) + '% ' + (rows * 100) + '%';
			paint();
		}

		function paint() {
			var a = current.anim;
			var cols = a.cols;
			var rows = Math.ceil(a.frames / cols);
			var col = current.frame % cols;
			var row = Math.floor(current.frame / cols);
			var x = cols > 1 ? (col / (cols - 1)) * 100 : 0;
			var y = rows > 1 ? (row / (rows - 1)) * 100 : 0;
			el.style.backgroundPosition = x + '% ' + y + '%';
		}

		function advanceFrame() {
			current.frame++;
			if (current.frame < current.anim.frames) {
				paint();
				return;
			}
			// animation finished one pass
			if (current.name === 'UseMe' || current.repeatsLeft-- > 0) {
				current.frame = 0;
				paint();
				return;
			}
			var next = queue.shift();
			startAnim(next || 'UseMe');
		}

		function tick(now) {
			if (!lastTick) lastTick = now;
			acc += now - lastTick;
			lastTick = now;
			var frameMs = 1000 / (current.anim.fps || DEFAULT_FPS);
			while (acc >= frameMs) {
				acc -= frameMs;
				advanceFrame();
				frameMs = 1000 / (current.anim.fps || DEFAULT_FPS);
			}
			requestAnimationFrame(tick);
		}

		function onActivate() {
			if (current.name !== 'UseMe') return; // ignore clicks mid-sequence
			queue = CLICK_SEQUENCE.filter(function (name) { return anims[name]; });
			startAnim(queue.shift());
		}

		el.addEventListener('click', onActivate);
		el.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onActivate();
			}
		});

		startAnim('UseMe');
		requestAnimationFrame(tick);
	}
})();
