var Watch = (function() {
	var shared = {};

	var allPreviews = [{
		title: 'Pilot',
		vid: './assets/vid/01-pilot.mp4',
		still: './assets/img/thumbnails/preview-thumb-01.jpg',
		description: 'Desperate to jump-start her career, struggling actress Ruth Wilder heads to a casting call at an LA gym -- and quickly realizes it\'s not a typical audition.',
	},{
		title: 'Slouch. Submit.',
		vid: './assets/vid/02-slouch-submit.mp4',
		still: './assets/img/thumbnails/preview-thumb-02.jpg',
		description: 'Cherry tries to whip the final group into shape, while Sam sets out in pursuit of a star for his show. Ruth acts out an uncomfortable scene.',
	},{
		title: 'The Wrath of Kuntar',
		vid: './assets/vid/02-slouch-submit.mp4',
		still: './assets/img/thumbnails/preview-thumb-03.jpg',
		description: 'Sam\'s flashy young producer drops in and whisks the girls off to Malibu to party. But artistic differences soon threaten to spoil the fun.',
	},];

	var videoButtons = {};
		videoButtons.isSoundOn = true;
		videoButtons.container = document.getElementById('videoControls');
		videoButtons.previous = document.getElementById('previous');
		videoButtons.next = document.getElementById('next');
		videoButtons.togglePause = document.getElementById('togglePause');
		videoButtons.stop = document.getElementById('stop');
		videoButtons.toggleMute = document.getElementById('toggleMute');

		videoButtons.removeAllEventListeners = function () {
			videoButtons.previous.removeEventListener('click', playPreviousVideo);
			videoButtons.next.removeEventListener('click', playNextVideo);
			videoButtons.stop.removeEventListener('click', stopVideo);
			videoButtons.togglePause.removeEventListener('click', togglePause);
			videoButtons.toggleMute.removeEventListener('click', toggleMute);
		}

		videoButtons.addAllEventListeners = function() {
			videoButtons.previous.addEventListener('click', playPreviousVideo);
			videoButtons.next.addEventListener('click', playNextVideo);
			videoButtons.stop.addEventListener('click', stopVideo);
			videoButtons.togglePause.addEventListener('click', togglePause);
			videoButtons.toggleMute.addEventListener('click', toggleMute);
		}

		videoButtons.removeListeners = {
			'previous': function() {
				videoButtons.previous.removeEventListener('click', playPreviousVideo);
			},
			'next': function() {
				videoButtons.next.removeEventListener('click', playNextVideo);
			},
			'stop': function() {
				videoButtons.stop.removeEventListener('click', stopVideo);
			},
			'togglePause': function() {
				videoButtons.togglePause.removeEventListener('click', togglePause);
			},
			'toggleMute': function() {
				videoButtons.toggleMute.removeEventListener('click', toggleMute);
			},
		};

		videoButtons.addListeners = {
			'previous': function() {
				videoButtons.previous.addEventListener('click', playPreviousVideo);
			},
			'next': function() {
				videoButtons.next.addEventListener('click', playNextVideo);
			},
			'stop': function() {
				videoButtons.stop.addEventListener('click', stopVideo);
			},
			'togglePause': function() {
				videoButtons.togglePause.addEventListener('click', togglePause);
			},
			'toggleMute': function() {
				videoButtons.toggleMute.addEventListener('click', toggleMute);
			},
		};

	var videoObjects = {};
		videoObjects.previewNavContainer = document.getElementById('previewNavContainer');
		videoObjects.currentPreviewContainer = document.getElementById('currentPreviewContainer');
		videoObjects.largestIndexNumber = ( allPreviews.length - 1 );
		videoObjects.activeVideo = {};

	function buildPageComponents() {

		var allPreviewNavItems = {};
		var allVideoElements = {};

		for (var i = 0; i < allPreviews.length; i++) {
			var previewNavItem = createPreviewElement(i);
				allPreviewNavItems[i] = previewNavItem;
				videoObjects.previewNavContainer.appendChild(previewNavItem);

			var videoElement = createVideoElement(i);
				allVideoElements[i] = videoElement;
		}

		videoObjects.allPreviewNavItems = allPreviewNavItems;
		videoObjects.allVideoElements = allVideoElements;
	}

	function createPreviewElement(i) {
		var previewNavItem = document.createElement('div');
			previewNavItem.classList.add('preview-nav__item');

		var previewImgSrc = 'url(' + allPreviews[i].still + ')';
		
		var previewImg = document.createElement('div');
			previewImg.classList.add('preview__image');
			previewImg.style.backgroundImage = previewImgSrc;

			previewImg.addEventListener("click", selectPreviewElement);

			previewImg.setAttribute('data-index-number', i);

		var playButton = document.createElement('figure');
			playButton.classList.add('play-button');
			playButton.setAttribute('data-index-number', i);
			previewImg.appendChild(playButton);
						

		var previewTitle = document.createElement('div');
			previewTitle.classList.add('preview-nav__title');
			previewTitle.innerHTML = allPreviews[i].title;

		var previewDescription = document.createElement('div');
			previewDescription.classList.add('preview-nav__description');
			previewDescription.innerHTML = allPreviews[i].description;

		previewNavItem.appendChild(previewImg);
		previewNavItem.appendChild(previewTitle);
		previewNavItem.appendChild(previewDescription);

		return previewNavItem;
	}

	function createVideoElement(i) {
		var videoElement = document.createElement('video');
			videoElement.src = allPreviews[i].vid;
			videoElement.type = 'video/mp4';
			videoElement.classList.add('preview__video--video');
			videoElement.autoplay = false;
			videoElement.muted = true;
			videoElement.indexNumber = i;
			videoElement.onended = function() {
				videoElement.parentElement.removeChild(videoElement);
				videoButtons.container.classList.remove('displayed');
			}
		return videoElement;
	}

	function selectPreviewElement(e) {
		if ( window.innerWidth > 800 ) {
			var i = e.target.dataset.indexNumber;
			mountVideoElement(i);
		} else {
			return;
		}
	}
		

	function mountVideoElement(i) {

		var videoContainer = videoObjects.currentPreviewContainer;
		var videoToMount = videoObjects.allVideoElements[i];

		if (videoContainer.firstChild) {
			if (videoContainer.firstChild == videoToMount) {
				console.log('already mounted');
				return;
			} 

			while (videoContainer.firstChild) {
				videoContainer.removeChild(videoContainer.firstChild);	
			}

		} else if ( !videoContainer.firstChild ) {
			videoButtons.container.classList.add('displayed');
		}
		

		videoButtons.togglePause.classList.add('pause');
		videoButtons.toggleMute.classList.add('turn-sound-off');

		videoObjects.activeVideo = videoToMount;
		videoContainer.appendChild(videoToMount);

		videoToMount.muted = false;
		videoToMount.play();	
	}

	function removeVideoElement(targetVideo) {

		targetVideo.pause();
		targetVideo.currentTime = 0;
		videoButtons.togglePause.classList.remove('pause');
		videoButtons.togglePause.classList.remove('play');

		targetVideo.parentNode.removeChild(targetVideo);
		
	}

	function playPreviousVideo() {

		var targetVideo = videoObjects.activeVideo;

		if ( targetVideo.currentTime > 10 || targetVideo.currentTime > (targetVideo.duration / 5)) {
			targetVideo.pause();
			targetVideo.currentTime = 0;
			targetVideo.play();
			return;

		} else {
			var i;

			if (targetVideo.indexNumber == 0) {
				i = videoObjects.largestIndexNumber;
				removeVideoElement(targetVideo);
			} else {
				i = targetVideo.indexNumber - 1;
				removeVideoElement(targetVideo);
			}

			mountVideoElement(i);
		}
	}

	function playNextVideo() {
		var targetVideo = videoObjects.activeVideo;
		var i;

		if ( targetVideo == videoObjects.largestIndexNumber) {
			i = 0;
		} else if ( targetVideo.indexNumber < videoObjects.largestIndexNumber ) {
			i = targetVideo.indexNumber + 1;
		}

		removeVideoElement(targetVideo);
		mountVideoElement(i);
	}

	function togglePause(e) {
		var targetVideo = videoObjects.activeVideo;

		if ( !targetVideo.paused ) {
			targetVideo.pause();
			e.target.className = 'play';
		} else if ( targetVideo.paused ) {
			targetVideo.play();
			e.target.className = 'pause';
		}
	}

	function stopVideo() {
		var targetVideo = videoObjects.activeVideo;
		removeVideoElement(targetVideo);
		videoButtons.container.classList.remove('displayed');
	}

	function toggleMute(e) {

		console.log(e.target);
		console.log(videoObjects.allVideoElements);
		console.log(videoObjects.activeVideo.muted);
		if (videoButtons.isSoundOn === true) {
			// sound is playing
			videoButtons.isSoundOn = false;
			// turn sound off for all elements 
			for (var i = videoObjects.allVideoElements.length - 1; i >= 0; i--) {
				videoObjects.allVideoElements[i].setAttribute('muted', true);	
			}
			videoObjects.activeVideo.muted = true;
			// change button icon from turn sound off to turn sound on 
			e.target.classList.remove('turn-sound-off');
			e.target.classList.add('turn-sound-on');
		} else if (videoButtons.isSoundOn === false) {
			// sound is not playing
			videoButtons.isSoundOn = true;
			// turn on sound ONLY for current video
			videoObjects.activeVideo.muted = false;
			//change button icon from turn sound on to turn sound off
			e.target.classList.remove('turn-sound-on');
			e.target.classList.add('turn-sound-off');
		}
	}


	function init() {
		console.log('watch init');
		buildPageComponents();
		videoButtons.addAllEventListeners();
	}

	shared.init = init;

	return shared;
}());

var Global = (function() {
	var shared = {};

	function openingAnimation() {
		var evenAnimations = document.querySelectorAll('.index-animation-even');
		var oddAnimations = document.querySelectorAll('.index-animation-odd');
		var firstAnimation = document.getElementById('indexAnimationFirst');
		function loadWatch() {
			window.location.href = './watch.html';
		}
		
		var glowAnimation = new TimelineMax({onComplete: loadWatch});
			glowAnimation.add( TweenMax.to(indexAnimationContainer, 1.5, {
				scale: 2, yoyo:true, repeat:1}), 0);
			glowAnimation.add( TweenMax.from(indexAnimationContainer, 3, {
				rotation: "-20deg"}), 0);
			glowAnimation.add( TweenMax.staggerTo(oddAnimations, 3, { top: -500 + "px", left: -500 + "px", opacity: 0}, 0.25), 0.5);
			glowAnimation.add( TweenMax.staggerTo(evenAnimations, 3, { top: 1500 + "px", left: 1500 + "px", opacity: 0}, 0.25), 0.5);
			glowAnimation.add( TweenMax.to(firstAnimation, 1, { scale: 5, opacity: 0}, 2.5));
	}

	function navSetup() {
		var hamburger = document.querySelector('.hamburger');
		var navbar = document.querySelector('.navbar');
		var header = document.querySelector('.Header__not-nav');

		function toggleNav() {
			if (!hamburger.classList.contains('active')) {
				hamburger.classList.add('active');
				navbar.classList.add('active');
				header.classList.add('active');
			} else if (hamburger.classList.contains('active')) {
				hamburger.classList.remove('active');
				navbar.classList.remove('active');
				header.classList.remove('active');
			}
		}

		hamburger.addEventListener('click', toggleNav);
	}

	function init() {
		if (document.body.id == 'index') {
			openingAnimation();
		}

		navSetup();
	}

	shared.init = init;
	return shared;
}());

var Characters = (function() {
	var shared = [];

	var characters = [{
			id: 'zoya',
			iconFile: 'zoya.svg',
			mainImageFile: 'zoya-info-bg.jpg',
			actorName: 'Alison Brie',
			wrestlingName: 'Zoya the Destroya',
			characterName: 'Ruth Wilder',
		},{
			id: 'jenny',
			iconFile: 'jenny2.svg',
		},{
			id: 'britannica',
			iconFile: 'britannica.svg',
		},{
			id: 'glowbot',
			iconFile: 'glowbot.svg',
		},{
			id: 'beirut',
			iconFile: 'beirut.svg',
		},{
			id: 'liberty',
			iconFile: 'liberty.svg',
		},{
			id: 'vicky',
			iconFile: 'vicky.svg',
		},{
			id: 'junkchain',
			iconFile: 'junkchain.svg',
		},{
			id: 'edna',
			iconFile: 'edna.svg',
		},{
			id: 'ethel',
			iconFile: 'ethel.svg',
		},{
			id: 'sheila',
			iconFile: 'sheila.svg',
		},{
			id: 'queen',
			iconFile: 'queen.svg',
		},{
			id: 'director',
			iconFile: 'director.svg',
		},{
			id: 'macchu',
			iconFile: 'macchu.svg',
		},{
			id: 'melrose',
			iconFile: 'melrose.svg',
		},{
			id: 'justine',
			iconFile: 'justine.svg',
		},];

	function createCharacterIcons() {

		var allIcons = [];
		var iconContainer = document.getElementById('characterIcons');
		var denominator = characters.length - 1;
		var marginLeft = (  (100 - (denominator + 1) ) / denominator  );
		var middleMarginLeft = (  (100 - (denominator/2.4) ) / denominator  );
		var halfwayPoint = Math.floor(denominator/2);

		for (var i = 0; i < characters.length; i++) {

			var icon = document.createElement('figure');
			icon.style.backgroundImage = 'url(../assets/img/character_icons/' + characters[i].iconFile + ')';
			
			icon.setAttribute('id', characters[i].id + 'Icon');

			if ( i != ( halfwayPoint ) ) {
				icon.style.left = (((i + 1) * marginLeft) + 2) + 'vw';

			}

			if ( i == (halfwayPoint) ) {
				icon.style.left = ((i + 1) * middleMarginLeft) + 'vw';
			}

			allIcons.push(icon);
			iconContainer.appendChild(icon);
		}
	}

	function init() {
		console.log('characters init');
		createCharacterIcons();
	}

	shared.init = init;
	return shared;
}());

function initPage() {
	Global.init();

	if ( document.body.id == 'watch') {
		Watch.init();
	} else if ( document.body.id == 'characters') {
		Characters.init();
	}
}

initPage();