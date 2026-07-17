/* David Glazier portfolio shared behavior:
   nav, rainbow titles, scroll reveal, slideshows, hero carousel, media reel. */
(function () {
	'use strict';

	/* ---------- header + mobile nav ---------- */
	var header = document.querySelector('.site-header');
	if (header) {
		var onScroll = function () {
			header.classList.toggle('solid', window.scrollY > 40);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}

	var overlay = document.getElementById('nav-overlay');
	var openBtn = document.getElementById('menu-open');
	var closeBtn = document.getElementById('menu-close');
	if (overlay && openBtn && closeBtn) {
		openBtn.addEventListener('click', function () { overlay.classList.add('open'); });
		closeBtn.addEventListener('click', function () { overlay.classList.remove('open'); });
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay || e.target.tagName === 'A') overlay.classList.remove('open');
		});
	}

	/* ---------- My Work dropdown ---------- */
	document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
		var trigger = dd.querySelector('.nav-dropdown-trigger');
		if (!trigger) return;
		var closeTimer = null;
		var HOVER_CLOSE_MS = 350;

		function isFinePointer() {
			return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		}

		function openDropdown() {
			clearTimeout(closeTimer);
			closeTimer = null;
			dd.classList.add('open');
			trigger.setAttribute('aria-expanded', 'true');
		}

		function scheduleCloseDropdown() {
			clearTimeout(closeTimer);
			closeTimer = setTimeout(function () {
				dd.classList.remove('open');
				trigger.setAttribute('aria-expanded', 'false');
				closeTimer = null;
			}, HOVER_CLOSE_MS);
		}

		dd.addEventListener('mouseenter', function () {
			if (isFinePointer()) openDropdown();
		});
		dd.addEventListener('mouseleave', function () {
			if (isFinePointer()) scheduleCloseDropdown();
		});

		trigger.addEventListener('click', function (e) {
			if (isFinePointer()) {
				/* desktop: hover opens menu; click still goes to #work */
				return;
			}
			e.preventDefault();
			if (dd.classList.contains('open')) {
				dd.classList.remove('open');
				trigger.setAttribute('aria-expanded', 'false');
			} else {
				openDropdown();
			}
		});
		document.addEventListener('click', function (e) {
			if (!dd.contains(e.target)) {
				clearTimeout(closeTimer);
				dd.classList.remove('open');
				trigger.setAttribute('aria-expanded', 'false');
			}
		});
	});

	/* ---------- rainbow letter coloring ---------- */
	document.querySelectorAll('.rainbow').forEach(function (el) {
		var text = el.textContent;
		el.textContent = '';
		var ci = 0;
		for (var i = 0; i < text.length; i++) {
			var ch = text[i];
			if (ch === ' ') {
				el.appendChild(document.createTextNode(' '));
				continue;
			}
			var span = document.createElement('span');
			span.className = 'rl-' + ((ci % 4) + 1);
			span.textContent = ch;
			el.appendChild(span);
			ci++;
		}
	});

	/* ---------- scroll reveal ---------- */
	var revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window && revealEls.length) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) {
					en.target.classList.add('shown');
					io.unobserve(en.target);
				}
			});
		}, { threshold: 0.12 });
		revealEls.forEach(function (el) { io.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add('shown'); });
	}

	/* ---------- autoplay muted videos sitewide ---------- */
	document.querySelectorAll('video').forEach(function (v) {
		v.muted = true;
		v.setAttribute('muted', '');
		v.setAttribute('playsinline', '');
		v.autoplay = true;
		v.loop = true;
		var play = function () { v.play().catch(function () {}); };
		play();
		v.addEventListener('loadeddata', play);
	});

	/* ---------- slideshows ---------- */
	document.querySelectorAll('.slideshow').forEach(function (box) {
		var imgs = Array.prototype.slice.call(box.querySelectorAll('img'));
		if (!imgs.length) return;
		var idx = 0;
		var interval = parseInt(box.dataset.interval || '4200', 10);
		var timer = null;

		var dots = document.createElement('div');
		dots.className = 'ss-dots';
		imgs.forEach(function (_, i) {
			var d = document.createElement('i');
			d.addEventListener('click', function () { go(i, true); });
			dots.appendChild(d);
		});
		box.appendChild(dots);

		function mkBtn(cls, label, delta) {
			var b = document.createElement('button');
			b.className = 'ss-nav ' + cls;
			b.setAttribute('aria-label', label);
			b.textContent = delta < 0 ? '\u2039' : '\u203A';
			b.addEventListener('click', function () { go(idx + delta, true); });
			box.appendChild(b);
		}
		if (imgs.length > 1) {
			mkBtn('ss-prev', 'Previous image', -1);
			mkBtn('ss-next', 'Next image', 1);
		}

		function render() {
			imgs.forEach(function (im, i) { im.classList.toggle('on', i === idx); });
			Array.prototype.forEach.call(dots.children, function (d, i) {
				d.classList.toggle('on', i === idx);
			});
		}

		function go(i, user) {
			idx = (i + imgs.length) % imgs.length;
			render();
			if (user) restart();
		}

		function restart() {
			if (timer) clearInterval(timer);
			if (imgs.length > 1) timer = setInterval(function () { go(idx + 1, false); }, interval);
		}

		render();
		restart();
	});

	/* ---------- TikTok-style media reel ---------- */
	(function initMediaReel() {
		var PROJECTS = {
			'fallen-fate': {
				name: 'Fallen Fate',
				href: 'fallen-fate.html',
				icon: 'img/icons/fallen-fate.png',
				desc: 'Horror rhythm pixel-art game. Role: Code Lead.'
			},
			'political-party-animal': {
				name: 'Political Party Animal',
				href: 'political-party-animal.html',
				icon: 'img/icons/political-party-animal.png',
				desc: 'Satirical election puzzle game. Role: Artist & Programmer.',
				pixelIcon: true
			},
			'art-fight': {
				name: 'Art Fight',
				href: 'art-fight.html',
				icon: 'img/icons/art-fight.png',
				desc: 'Yearly character art attacks. Role: Artist.'
			},
			'au-bon-cake': {
				name: 'Au Bon Cake',
				href: 'au-bon-cake.html',
				icon: 'img/icons/au-bon-cake.jpg',
				desc: 'Bakery brand, ads, and 3D CAD. Role: 3D modeler & Graphic Designer.'
			},
			'personal-3d': {
				name: '3D Personal Projects',
				href: 'personal-3d.html',
				icon: 'img/icons/personal-3d.png',
				desc: '3D renders and character acting. Role: Artist & Programmer.'
			},
			'demo-reel': {
				name: 'Demo Reel',
				href: 'demo-reel.html',
				icon: 'img/icons/demo-reel.jpg',
				desc: 'Selected animation and game work. Role: Artist & Programmer.'
			}
		};

		var PAGE_PROJECT = {
			'demo-reel.html': 'demo-reel',
			'fallen-fate.html': 'fallen-fate',
			'political-party-animal.html': 'political-party-animal',
			'art-fight.html': 'art-fight',
			'au-bon-cake.html': 'au-bon-cake',
			'personal-3d.html': 'personal-3d'
		};

		var pageFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
		var liked = {};
		try { liked = JSON.parse(localStorage.getItem('dg-reel-likes') || '{}') || {}; } catch (e) { liked = {}; }

		function mediaSrc(el) {
			if (el.tagName === 'VIDEO') {
				var s = el.querySelector('source');
				return s ? s.getAttribute('src') || s.src : el.getAttribute('src') || el.src;
			}
			return el.getAttribute('src') || el.currentSrc || el.src || '';
		}

		function absUrl(path) {
			try { return new URL(path, location.href).href; } catch (e) { return path; }
		}

		function detectProject(el, src) {
			var card = el.closest('.work-card');
			if (card) {
				var title = (card.querySelector('h3') || {}).textContent || '';
				title = title.replace(/\s+/g, ' ').trim().toLowerCase();
				if (title.indexOf('demo reel') !== -1) return 'demo-reel';
				if (title.indexOf('fallen fate') !== -1) return 'fallen-fate';
				if (title.indexOf('political') !== -1 || title.indexOf('party animal') !== -1) return 'political-party-animal';
				if (title.indexOf('art fight') !== -1) return 'art-fight';
				if (title.indexOf('au bon') !== -1) return 'au-bon-cake';
				if (title.indexOf('3d') !== -1 || title.indexOf('personal') !== -1) return 'personal-3d';
			}
			if (PAGE_PROJECT[pageFile]) return PAGE_PROJECT[pageFile];
			var low = (src || '').toLowerCase();
			if (low.indexOf('demo-reel') !== -1) return 'demo-reel';
			if (low.indexOf('fallen-fate') !== -1 || low.indexOf('/ff-') !== -1 || low.indexOf('ff-') !== -1) return 'fallen-fate';
			if (low.indexOf('political') !== -1 || low.indexOf('ppa-') !== -1 || low.indexOf('city-banner') !== -1 || low.indexOf('us-map') !== -1) return 'political-party-animal';
			if (low.indexOf('art-fight') !== -1 || low.indexOf('artfight') !== -1) return 'art-fight';
			if (low.indexOf('au-bon-cake') !== -1 || low.indexOf('aubon') !== -1) return 'au-bon-cake';
			if (low.indexOf('personal-3d') !== -1 || low.indexOf('heavy-object') !== -1) return 'personal-3d';
			return 'demo-reel';
		}

		var sources = [];
		var clickables = document.querySelectorAll(
			'.media-grid img, .media-full img, .media-full video, .proj-section video, .slideshow img, .art-wall img, .favorites-grid img, .concept-row img, .concept-solo img, .work-media img, .work-media video, [data-reel-open]'
		);

		clickables.forEach(function (el) {
			if (el.closest('.proj-hero')) return;
			if (el.hasAttribute('data-reel-open') && el.tagName !== 'IMG' && el.tagName !== 'VIDEO') return;
			var src = mediaSrc(el);
			if (!src) return;
			var projectId = detectProject(el, src);
			if (el.tagName === 'VIDEO') {
				sources.push({
					type: 'video',
					src: src,
					poster: el.getAttribute('poster') || '',
					projectId: projectId
				});
			} else {
				/* Explicit pixel-art marks win; otherwise only tiny native sprites. */
				var isPixelArt = el.classList.contains('pixel-art') ||
					Boolean(el.closest('.pixel-art-source')) ||
					(el.naturalWidth > 0 && el.naturalWidth <= 256 &&
						el.naturalHeight > 0 && el.naturalHeight <= 256);
				sources.push({
					type: 'image',
					src: src,
					alt: el.alt || '',
					pixel: isPixelArt,
					projectId: projectId
				});
			}
		});

		var seen = {};
		sources = sources.filter(function (item) {
			var key = item.src + '|' + item.projectId;
			if (seen[key]) return false;
			seen[key] = true;
			return true;
		});
		if (!sources.length) return;

		var n = sources.length;

		var reel = document.createElement('div');
		reel.className = 'media-reel';
		reel.setAttribute('hidden', '');
		reel.innerHTML =
			'<div class="media-reel-chrome">' +
				'<a class="media-reel-brand" href="index.html"><img src="img/logo-david-glazier.png" alt="David Glazier"></a>' +
				'<button class="media-reel-close" type="button" aria-label="Close">&times;</button>' +
			'</div>' +
			'<div class="media-reel-track"></div>' +
			'<button class="media-reel-back-top" type="button" hidden>Go back to top</button>' +
			'<div class="media-reel-hint" hidden>' +
				'<div class="media-reel-finger" aria-hidden="true"></div>' +
				'<p>Scroll down to see more</p>' +
			'</div>' +
			'<div class="media-reel-share" hidden>' +
				'<div class="media-reel-share-sheet" role="dialog" aria-label="Share">' +
					'<p class="media-reel-share-title">Share</p>' +
					'<button type="button" data-share="email">Email</button>' +
					'<button type="button" data-share="text">Text</button>' +
					'<button type="button" data-share="copy">Copy Link</button>' +
					'<button type="button" class="media-reel-share-cancel" data-share="cancel">Cancel</button>' +
				'</div>' +
			'</div>';
		document.body.appendChild(reel);

		var track = reel.querySelector('.media-reel-track');
		var sharePanel = reel.querySelector('.media-reel-share');
		var backTopBtn = reel.querySelector('.media-reel-back-top');
		var videoObserver = null;
		var activeAudioVideo = null;
		var centeredVideo = null;
		var userMutedCurrent = false;
		var playbackRaf = 0;

		function heartSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
		}

		function seeMoreSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="12" height="14" rx="2"/><rect x="9" y="3" width="12" height="14" rx="2"/></svg>';
		}

		function shareSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l6 6-6 6M20 10H9a5 5 0 0 0-5 5v3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		}

		function contactSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4"/><path d="M4 20c1.5-3.5 4.2-5 8-5s6.5 1.5 8 5"/></svg>';
		}

		function fullscreenSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
		}

		function volumeOnSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
		}

		function volumeOffSvg() {
			return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M18 9l4 6M22 9l-4 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
		}

		function volumeButtonHtml() {
			return '<button class="media-reel-volume" type="button" aria-pressed="false" aria-label="Volume off" title="Volume">' +
				'<span class="media-reel-volume-icon">' + volumeOffSvg() + '</span>' +
				'<span class="media-reel-volume-label">OFF</span>' +
			'</button>';
		}

		function setVolumeButtonState(video, on) {
			var stage = video.closest('.media-reel-stage');
			var btn = stage && stage.querySelector('.media-reel-volume');
			if (!btn) return;
			btn.classList.toggle('is-on', on);
			btn.setAttribute('aria-pressed', on ? 'true' : 'false');
			btn.setAttribute('aria-label', on ? 'Volume on' : 'Volume off');
			var icon = btn.querySelector('.media-reel-volume-icon');
			var label = btn.querySelector('.media-reel-volume-label');
			if (icon) icon.innerHTML = on ? volumeOnSvg() : volumeOffSvg();
			if (label) label.textContent = on ? 'ON' : 'OFF';
		}

		function muteVideo(video) {
			if (!video) return;
			video.muted = true;
			video.volume = 0;
			setVolumeButtonState(video, false);
			if (activeAudioVideo === video) activeAudioVideo = null;
		}

		function unmuteVideo(video) {
			if (!video) return;
			Array.prototype.forEach.call(track.querySelectorAll('video'), function (other) {
				if (other !== video) muteVideo(other);
			});
			video.muted = false;
			video.volume = 1;
			activeAudioVideo = video;
			setVolumeButtonState(video, true);
			video.play().catch(function () {});
		}

		function pauseAndMuteVideo(video) {
			if (!video) return;
			video.pause();
			muteVideo(video);
		}

		function buildSlide(item, logicalIndex) {
			var project = PROJECTS[item.projectId] || PROJECTS['demo-reel'];
			var likeKey = item.src;
			var isLiked = Boolean(liked[likeKey]);
			var slide = document.createElement('div');
			slide.className = 'media-reel-slide';
			slide.dataset.index = String(logicalIndex);
			slide.dataset.project = item.projectId;
			slide.dataset.src = item.src;

			var mediaHtml;
			var volumeHtml = '';
			if (item.type === 'video') {
				mediaHtml = '<video muted loop playsinline webkit-playsinline' +
					(item.poster ? ' poster="' + item.poster + '"' : '') +
					'><source src="' + item.src + '" type="video/mp4"></video>';
				volumeHtml = volumeButtonHtml();
			} else {
				mediaHtml = '<img' + (item.pixel ? ' class="reel-pixel-art"' : '') +
					' src="' + item.src + '" alt="' + (item.alt || project.name) + '">';
			}

			slide.innerHTML =
				'<div class="media-reel-stage">' +
					mediaHtml +
					volumeHtml +
					'<button class="media-reel-fullscreen" type="button" aria-label="Go fullscreen" title="Fullscreen">' +
						fullscreenSvg() +
					'</button>' +
				'</div>' +
				'<div class="media-reel-meta">' +
					'<a class="media-reel-icon" href="' + project.href + '">' +
						'<img src="' + project.icon + '" alt=""' + (project.pixelIcon ? ' class="pixelated-icon"' : '') + '>' +
					'</a>' +
					'<div class="media-reel-meta-text">' +
						'<a class="media-reel-title" href="' + project.href + '">' + project.name + '</a>' +
						'<p class="media-reel-by">By David Glazier</p>' +
						'<a class="media-reel-learn" href="' + project.href + '">LEARN MORE</a>' +
						'<p class="media-reel-desc">' + project.desc + '</p>' +
					'</div>' +
				'</div>' +
				'<div class="media-reel-actions">' +
					'<a class="media-reel-action" href="' + project.href + '">' +
						'<span class="media-reel-action-icon see-more">' + seeMoreSvg() + '</span>' +
						'<span>See More</span>' +
					'</a>' +
					'<button class="media-reel-action media-reel-like' + (isLiked ? ' is-liked' : '') + '" type="button" aria-label="Like" data-like-key="' + likeKey.replace(/"/g, '') + '">' +
						'<span class="media-reel-action-icon like-heart">' + heartSvg() + '</span>' +
						'<span>Like</span>' +
					'</button>' +
					'<button class="media-reel-action media-reel-share-btn" type="button" aria-label="Share">' +
						'<span class="media-reel-action-icon share-arrow">' + shareSvg() + '</span>' +
						'<span>Share</span>' +
					'</button>' +
					'<a class="media-reel-action" href="index.html#contact">' +
						'<span class="media-reel-action-icon contact-me">' + contactSvg() + '</span>' +
						'<span>Contact Me</span>' +
					'</a>' +
				'</div>';

			return slide;
		}

		function sizePixelArt(root) {
			var scope = root || track;
			Array.prototype.forEach.call(scope.querySelectorAll('.reel-pixel-art'), function (img) {
				function resize() {
					if (!img.naturalWidth || !img.naturalHeight) return;
					var padX = window.innerWidth <= 640 ? 100 : 150;
					var padY = window.innerWidth <= 640 ? 230 : 200;
					var maxWidth = Math.max(200, window.innerWidth - padX);
					var maxHeight = Math.max(200, window.innerHeight - padY);
					/* Integer nearest-neighbor scale only — never stretch fractional pixels. */
					var scale = Math.max(1, Math.floor(Math.min(
						maxWidth / img.naturalWidth,
						maxHeight / img.naturalHeight
					)));
					var minEdge = Math.min(maxWidth, maxHeight) * 0.7;
					while (
						Math.max(img.naturalWidth, img.naturalHeight) * scale < minEdge &&
						img.naturalWidth * (scale + 1) <= maxWidth &&
						img.naturalHeight * (scale + 1) <= maxHeight
					) {
						scale += 1;
					}
					img.style.width = (img.naturalWidth * scale) + 'px';
					img.style.height = (img.naturalHeight * scale) + 'px';
					img.style.maxWidth = 'none';
					img.style.maxHeight = 'none';
					img.style.objectFit = 'contain';
				}
				if (img.complete && img.naturalWidth) resize();
				else img.addEventListener('load', resize, { once: true });
			});
		}

		function getCurrentVideo() {
			var trackRect = track.getBoundingClientRect();
			var centerY = trackRect.top + trackRect.height / 2;
			var best = null;
			var bestDist = Infinity;
			Array.prototype.forEach.call(track.querySelectorAll('.media-reel-slide video'), function (video) {
				var slide = video.closest('.media-reel-slide');
				if (!slide) return;
				var r = slide.getBoundingClientRect();
				var overlap = Math.min(r.bottom, trackRect.bottom) - Math.max(r.top, trackRect.top);
				if (overlap < r.height * 0.4) return;
				var dist = Math.abs((r.top + r.height / 2) - centerY);
				if (dist < bestDist) {
					bestDist = dist;
					best = video;
				}
			});
			return best;
		}

		function refreshVideoPlayback() {
			var current = getCurrentVideo();
			if (current !== centeredVideo) {
				centeredVideo = current;
				userMutedCurrent = false;
			}

			Array.prototype.forEach.call(track.querySelectorAll('video'), function (video) {
				if (video === current) {
					video.play().catch(function () {});
				} else {
					/* Scrolled past: freeze frame and mute so only center audio plays. */
					pauseAndMuteVideo(video);
				}
			});

			if (!current) return;

			if (userMutedCurrent) {
				muteVideo(current);
				return;
			}

			if (activeAudioVideo !== current) unmuteVideo(current);
			else {
				current.muted = false;
				current.volume = 1;
				setVolumeButtonState(current, true);
			}
		}

		function schedulePlaybackRefresh() {
			if (playbackRaf) cancelAnimationFrame(playbackRaf);
			playbackRaf = requestAnimationFrame(function () {
				playbackRaf = 0;
				refreshVideoPlayback();
			});
		}

		function syncVideos() {
			if (videoObserver) {
				videoObserver.disconnect();
				videoObserver = null;
			}
			activeAudioVideo = null;
			centeredVideo = null;
			userMutedCurrent = false;
			var videos = track.querySelectorAll('video');
			if (!videos.length) return;
			Array.prototype.forEach.call(videos, function (video) {
				video.muted = true;
				video.volume = 0;
				setVolumeButtonState(video, false);
			});
			videoObserver = new IntersectionObserver(function () {
				schedulePlaybackRefresh();
			}, { root: track, threshold: [0, 0.25, 0.45, 0.6, 0.75, 1] });
			Array.prototype.forEach.call(videos, function (video) {
				videoObserver.observe(video);
			});
		}

		function rebuildGallery() {
			track.innerHTML = '';
			var strip = document.createElement('div');
			strip.className = 'media-reel-strip';
			for (var i = 0; i < n; i++) {
				strip.appendChild(buildSlide(sources[i], i));
			}
			track.appendChild(strip);
			sizePixelArt();
			syncVideos();
		}

		function nearGalleryBottom() {
			if (track.scrollHeight <= track.clientHeight + 8) return false;
			var remaining = track.scrollHeight - track.scrollTop - track.clientHeight;
			return remaining <= 72;
		}

		function updateBackTop() {
			if (reel.hasAttribute('hidden')) {
				backTopBtn.hidden = true;
				return;
			}
			backTopBtn.hidden = !nearGalleryBottom();
		}

		function openAt(index) {
			index = Math.max(0, Math.min(index, n - 1));
			reel.removeAttribute('hidden');
			document.body.classList.add('reel-open');
			sharePanel.hidden = true;
			backTopBtn.hidden = true;
			rebuildGallery();
			var slides = track.querySelectorAll('.media-reel-slide');
			var openVideo = slides[index] && slides[index].querySelector('video');
			/* Unmute in the same turn as the open click so autoplay-with-sound is allowed. */
			if (openVideo) unmuteVideo(openVideo);
			requestAnimationFrame(function () {
				if (slides[index]) track.scrollTop = slides[index].offsetTop;
				else track.scrollTop = 0;
				updateBackTop();
				schedulePlaybackRefresh();
				if (openVideo && activeAudioVideo === openVideo) {
					openVideo.muted = false;
					openVideo.volume = 1;
					setVolumeButtonState(openVideo, true);
					openVideo.play().catch(function () {});
				}
			});
			if (!localStorage.getItem('dg-reel-hint-seen')) {
				var hint = reel.querySelector('.media-reel-hint');
				hint.hidden = false;
				localStorage.setItem('dg-reel-hint-seen', '1');
				setTimeout(function () { hint.hidden = true; }, 3200);
			}
		}

		function close() {
			reel.setAttribute('hidden', '');
			document.body.classList.remove('reel-open');
			sharePanel.hidden = true;
			backTopBtn.hidden = true;
			activeAudioVideo = null;
			centeredVideo = null;
			userMutedCurrent = false;
			if (playbackRaf) {
				cancelAnimationFrame(playbackRaf);
				playbackRaf = 0;
			}
			if (videoObserver) {
				videoObserver.disconnect();
				videoObserver = null;
			}
			Array.prototype.forEach.call(track.querySelectorAll('video'), function (v) {
				v.pause();
				v.muted = true;
				v.volume = 0;
			});
			if (document.fullscreenElement) {
				document.exitFullscreen().catch(function () {});
			}
		}

		window.DGOpenMediaReel = openAt;

		track.addEventListener('scroll', function () {
			updateBackTop();
			schedulePlaybackRefresh();
		}, { passive: true });
		window.addEventListener('resize', function () {
			if (reel.hasAttribute('hidden')) return;
			sizePixelArt();
			updateBackTop();
			schedulePlaybackRefresh();
		});

		backTopBtn.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			track.scrollTo({ top: 0, behavior: 'smooth' });
		});

		reel.querySelector('.media-reel-close').addEventListener('click', function (e) {
			e.stopPropagation();
			close();
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && !reel.hasAttribute('hidden')) {
				if (!sharePanel.hidden) sharePanel.hidden = true;
				else if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
				else close();
			}
		});

		reel.addEventListener('click', function (e) {
			if (e.target.closest('.media-reel-chrome, .media-reel-meta, .media-reel-actions, .media-reel-share-sheet, .media-reel-stage, .media-reel-hint, .media-reel-fullscreen, .media-reel-volume, .media-reel-back-top, .media-reel-strip')) {
				return;
			}
			if (e.target === reel || e.target.classList.contains('media-reel-track')) {
				close();
			}
		});

		track.addEventListener('click', function (e) {
			var volumeBtn = e.target.closest('.media-reel-volume');
			if (volumeBtn) {
				e.preventDefault();
				e.stopPropagation();
				var stage = volumeBtn.closest('.media-reel-stage');
				var video = stage && stage.querySelector('video');
				if (!video) return;
				if (volumeBtn.classList.contains('is-on')) {
					userMutedCurrent = true;
					muteVideo(video);
				} else {
					userMutedCurrent = false;
					unmuteVideo(video);
				}
				return;
			}

			var fsBtn = e.target.closest('.media-reel-fullscreen');
			if (fsBtn) {
				e.preventDefault();
				e.stopPropagation();
				var fsStage = fsBtn.closest('.media-reel-stage');
				var media = fsStage && fsStage.querySelector('img, video');
				if (!media) return;
				var req = media.requestFullscreen || media.webkitRequestFullscreen || media.msRequestFullscreen;
				if (req) {
					req.call(media).catch(function () {});
				} else if (media.webkitEnterFullscreen) {
					media.webkitEnterFullscreen();
				}
				return;
			}

			var likeBtn = e.target.closest('.media-reel-like');
			if (likeBtn) {
				e.preventDefault();
				e.stopPropagation();
				var key = likeBtn.getAttribute('data-like-key');
				var nowLiked = !liked[key];
				liked[key] = nowLiked;
				if (!nowLiked) delete liked[key];
				try { localStorage.setItem('dg-reel-likes', JSON.stringify(liked)); } catch (err) {}
				Array.prototype.forEach.call(track.querySelectorAll('.media-reel-like'), function (btn) {
					if (btn.getAttribute('data-like-key') !== key) return;
					btn.classList.toggle('is-liked', nowLiked);
					if (nowLiked) {
						btn.classList.remove('pop');
						void btn.offsetWidth;
						btn.classList.add('pop');
					}
				});
				return;
			}

			var shareBtn = e.target.closest('.media-reel-share-btn');
			if (shareBtn) {
				e.preventDefault();
				e.stopPropagation();
				sharePanel.hidden = false;
				return;
			}
		});

		sharePanel.addEventListener('click', function (e) {
			var btn = e.target.closest('[data-share]');
			if (!btn) {
				if (e.target === sharePanel) sharePanel.hidden = true;
				return;
			}
			e.stopPropagation();
			var action = btn.getAttribute('data-share');
			var url = location.href;
			var title = document.title || 'David Glazier';
			if (action === 'cancel') {
				sharePanel.hidden = true;
				return;
			}
			if (action === 'email') {
				window.location.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(url);
				sharePanel.hidden = true;
				return;
			}
			if (action === 'text') {
				window.location.href = 'sms:?&body=' + encodeURIComponent(url);
				sharePanel.hidden = true;
				return;
			}
			if (action === 'copy') {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(url).then(function () {
						btn.textContent = 'Copied!';
						setTimeout(function () { btn.textContent = 'Copy Link'; sharePanel.hidden = true; }, 700);
					}).catch(function () {
						window.prompt('Copy this link:', url);
						sharePanel.hidden = true;
					});
				} else {
					window.prompt('Copy this link:', url);
					sharePanel.hidden = true;
				}
			}
		});

		function findSourceIndex(el) {
			var src = mediaSrc(el);
			var projectId = detectProject(el, src);
			var idx = sources.findIndex(function (s) {
				return absUrl(s.src) === absUrl(src) || s.src === src ||
					(src && s.src && (s.src.indexOf(src) !== -1 || src.indexOf(s.src) !== -1));
			});
			if (idx < 0) {
				idx = sources.findIndex(function (s) { return s.projectId === projectId; });
			}
			return idx < 0 ? 0 : idx;
		}

		function openFromEl(el, e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			openAt(findSourceIndex(el));
		}

		function bindOpen(el) {
			/* Native video controls steal taps on mobile; strip them and use a hit layer. */
			if (el.tagName === 'VIDEO') {
				el.removeAttribute('controls');
				el.controls = false;
				el.setAttribute('playsinline', '');
				el.setAttribute('webkit-playsinline', '');
			}
			el.style.cursor = 'zoom-in';

			var host = el.closest('.work-media, .media-full, .media-grid figure, .art-wall figure, .favorites-grid figure, .concept-row figure, .concept-solo, .slideshow') || el.parentElement;
			if (host && host !== document.body && !host.querySelector('.media-reel-hit')) {
				host.classList.add('has-reel-hit');
				var hit = document.createElement('button');
				hit.type = 'button';
				hit.className = 'media-reel-hit';
				hit.setAttribute('aria-label', 'Open media viewer');
				hit.addEventListener('click', function (e) {
					if (e.target.closest('.ss-nav, .ss-dots, .media-fs-btn')) return;
					openFromEl(el, e);
				});
				host.appendChild(hit);

				var fs = document.createElement('button');
				fs.type = 'button';
				fs.className = 'media-fs-btn';
				fs.setAttribute('aria-label', 'Go fullscreen');
				fs.title = 'Fullscreen';
				fs.innerHTML = fullscreenSvg();
				fs.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
					if (req) req.call(el).catch(function () {});
					else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
				});
				host.appendChild(fs);
			}

			el.addEventListener('click', function (e) {
				if (el.closest('.slideshow') && e.target.closest('.ss-nav, .ss-dots')) return;
				if (e.target.closest('.media-fs-btn')) return;
				openFromEl(el, e);
			});
		}

		document.querySelectorAll('.media-grid img, .media-full img, .slideshow img, .art-wall img, .favorites-grid img, .concept-row img, .concept-solo img, .media-full video, .proj-section video, .work-media img, .work-media video').forEach(function (el) {
			if (el.closest('.proj-hero')) return;
			bindOpen(el);
		});

		document.querySelectorAll('[data-reel-open]').forEach(function (el) {
			el.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var want = el.getAttribute('data-reel-open');
				var idx = sources.findIndex(function (s) { return s.src.indexOf(want) !== -1; });
				openAt(idx < 0 ? 0 : idx);
			});
		});
	})();

	/* ---------- hero card carousel (home page) ---------- */
	var carousel = document.getElementById('carousel');
	if (!carousel) return;

	var projects = [
		{
			title: 'Fallen Fate',
			desc: 'A horror and rhythm pixel-art game where I was the code lead.',
			image: 'img/posters/fallen-fate.jpg',
			tags: ['Unity Engine', 'C#', 'Game Mechanics Design'],
			actions: [
				{ label: 'Learn More', href: 'fallen-fate.html', className: 'btn-solid'},
				{ label: 'Play It Now', href: 'https://epicdavid.itch.io/fallen-fate', className: 'btn-ghost', external: true  }
			],
			pixel: false
		},
		{
			title: 'Political Party Animal',
			desc: 'A satirical puzzle game built for the 2024 Presidential Election',
			image: 'img/city-banner.png',
			tags: ['Pixel Art', 'Animation', 'Unity Engine', 'Game design', 'Game programming'],
			actions: [
				{ label: 'Learn More', href: 'political-party-animal.html', className: 'btn-solid' }
			],
			pixel: true
		},
		{
			title: 'Art Fight',
			desc: 'Yearly character art in various mediums.',
			image: 'img/slides/art-fight/07-thunderbird-attack.jpg',
			tags: ['Illustration', 'Photoshop', 'Mixed Media'],
			actions: [
				{ label: 'Learn More', href: 'art-fight.html', className: 'btn-solid' }
			],
			pixel: false
		},
		{
			title: 'Au Bon Cake',
			desc: 'Brand and ad design for a boutique kosher bakery. Emphasis on my 3D CAD modeling for physical cookie cutters, chocolate-molds.',
			image: 'img/slides/au-bon-cake/01-designer-bag-ad.jpg',
			tags: ['Graphic Design', 'Advertising', 'Photography', '3D Printing', 'Laser Cutting', 'Tinkercad', 'CAD', 'Glowforge'],
			actions: [
				{ label: 'Learn More', href: 'au-bon-cake.html', className: 'btn-solid' }
			],
			pixel: false
		},
		{
			title: '3D Personal Projects',
			desc: '3D renders and animations. Cozy rooms, Character Acting, etc..',
			image: 'img/slides/personal-3d/01-lego-living-room.jpg',
			tags: ['Blender', 'Modeling', 'Animation', 'AutoDesk Maya'],
			actions: [
				{ label: 'Learn More', href: 'personal-3d.html', className: 'btn-solid' }
			],
			pixel: false
		}
	];

	var indicatorsBox = document.getElementById('indicators');
	var current = 0;

	projects.forEach(function (p, i) {
		var item = document.createElement('div');
		item.className = 'carousel-item';
		var actions = p.actions.map(function (a) {
			return '<a class="btn ' + a.className + '" href="' + a.href + '"' +
				(a.external ? ' target="_blank" rel="noopener"' : '') + '>' + a.label + '</a>';
		}).join('');
		item.innerHTML =
			'<div class="pcard">' +
				'<div class="pcard-image' + (p.pixel ? ' pixelated' : '') + '"><img src="' + p.image + '" alt="' + p.title + '"></div>' +
				'<h3>' + p.title + '</h3>' +
				'<p>' + p.desc + '</p>' +
				'<div class="pcard-tags">' + p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
				'<div class="pcard-actions">' + actions + '</div>' +
			'</div>';
		item.addEventListener('click', function (e) {
			if (i !== current && !e.target.closest('a')) go(i);
		});
		carousel.appendChild(item);

		var dot = document.createElement('div');
		dot.className = 'indicator' + (i === 0 ? ' active' : '');
		dot.addEventListener('click', function () { go(i); });
		indicatorsBox.appendChild(dot);
	});

	var items = carousel.querySelectorAll('.carousel-item');

	function layout() {
		var n = items.length;
		var w = window.innerWidth;
		var sp1 = w <= 640 ? 210 : (w <= 1024 ? 300 : 400);
		var sp2 = w <= 640 ? 330 : (w <= 1024 ? 480 : 620);

		items.forEach(function (item, i) {
			var off = i - current;
			if (off > n / 2) off -= n;
			if (off < -n / 2) off += n;
			var abs = Math.abs(off);
			var sign = off < 0 ? -1 : 1;
			var x = 0, z = 0, ry = 0, op = 1, zi = 10;

			if (abs === 0) {
				z = 0;
			} else if (abs === 1) {
				x = sign * sp1; z = -230; ry = sign * -32; op = 0.75; zi = 8;
			} else if (abs === 2) {
				x = sign * sp2; z = -430; ry = sign * -46; op = 0.42; zi = 6;
			} else {
				x = sign * (sp2 + 160); z = -560; ry = sign * -52; op = 0; zi = 1;
			}

			item.style.transform =
				'translateY(-50%) translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + ry + 'deg)';
			item.style.opacity = op;
			item.style.zIndex = zi;
			item.style.pointerEvents = op === 0 ? 'none' : 'auto';
			item.classList.toggle('is-active', abs === 0);
		});

		Array.prototype.forEach.call(indicatorsBox.children, function (d, i) {
			d.classList.toggle('active', i === current);
		});
	}

	function go(i) {
		current = (i + items.length) % items.length;
		layout();
		restartAuto();
	}

	document.getElementById('prevBtn').addEventListener('click', function () { go(current - 1); });
	document.getElementById('nextBtn').addEventListener('click', function () { go(current + 1); });
	window.addEventListener('resize', layout);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') go(current - 1);
		if (e.key === 'ArrowRight') go(current + 1);
	});

	var touchX = null;
	carousel.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
	carousel.addEventListener('touchend', function (e) {
		if (touchX === null) return;
		var dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 46) go(current + (dx < 0 ? 1 : -1));
		touchX = null;
	}, { passive: true });

	var auto = null;
	function restartAuto() {
		if (auto) clearInterval(auto);
		auto = setInterval(function () { current = (current + 1) % items.length; layout(); }, 6500);
	}

	layout();
	restartAuto();
})();
