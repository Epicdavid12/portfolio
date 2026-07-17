(function () {
	var overlay = document.getElementById('nav-overlay');
	var openBtn = document.getElementById('menu-open');
	var closeBtn = document.getElementById('menu-close');

	openBtn.addEventListener('click', function () {
		overlay.classList.add('open');
	});

	closeBtn.addEventListener('click', function () {
		overlay.classList.remove('open');
	});

	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) overlay.classList.remove('open');
	});
})();
