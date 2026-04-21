
  $(document).on('ready', function() {
	'use strict';

  	//Pre-loader
	$(window).on('load', function() {
	 	$('.loader').fadeOut();
		$('.preloader').delay(250).fadeOut('slow');
		$('body').delay(250).css({'overflow':'visible'});
		$('body').addClass('loaded');
	 });
	 
	 // 安全机制：10秒后强制隐藏预加载器
	 setTimeout(function() {
		if ($('.preloader').is(':visible')) {
			$('.preloader').hide();
			$('body').css({'overflow':'visible'}).addClass('loaded');
		}
	 }, 10000);

	
	//Fixed menu
  	var fixed_top = $(".main-menu");

	$(window).on('scroll', function(){
		
		if( $(this).scrollTop() > 100 ){	
			fixed_top.addClass("menu-bg");
		}
		else{
			fixed_top.removeClass("menu-bg");
		}
		
	});


	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$('a.page-scroll').on('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
	});


	// Custom fullscreen gallery preview
	var galleryOverlay = $('#galleryOverlay');
	var galleryOverlayImage = $('#galleryOverlayImage');
	var galleryOverlayCounter = $('#galleryOverlayCounter');
	var galleryItems = $('.js-gallery-preview');
	var galleryIndex = -1;
	var touchStartX = null;
	var touchStartY = null;

	function updateGalleryCounter() {
		if (!galleryItems.length || galleryIndex < 0) return;
		galleryOverlayCounter.text((galleryIndex + 1) + ' / ' + galleryItems.length);
	}

	function openGallery(index) {
		if (index < 0 || index >= galleryItems.length) return;
		galleryIndex = index;
		var item = $(galleryItems.get(index));
		var full = item.attr('data-full') || item.attr('href');
		galleryOverlayImage.attr('src', full);
		updateGalleryCounter();
		galleryOverlay.addClass('is-visible').attr('aria-hidden', 'false');
		$('body').addClass('gallery-open');
	}

	function closeGallery() {
		galleryOverlay.removeClass('is-visible').attr('aria-hidden', 'true');
		galleryOverlayImage.attr('src', '');
		$('body').removeClass('gallery-open');
	}

	function stepGallery(step) {
		if (!galleryItems.length) return;
		var nextIndex = galleryIndex + step;
		if (nextIndex < 0) nextIndex = galleryItems.length - 1;
		if (nextIndex >= galleryItems.length) nextIndex = 0;
		openGallery(nextIndex);
	}

	galleryItems.on('click', function(event) {
		event.preventDefault();
		openGallery(galleryItems.index(this));
	});
	$('#galleryOverlayClose').on('click', function() {
		closeGallery();
	});
	$('#galleryOverlay').on('click', function(event) {
		if (event.target === this) closeGallery();
	});
	$('#galleryOverlayPrev').on('click', function(event) {
		event.stopPropagation();
		stepGallery(-1);
	});
	$('#galleryOverlayNext').on('click', function(event) {
		event.stopPropagation();
		stepGallery(1);
	});
	galleryOverlay.on('touchstart', function(event) {
		if (!event.originalEvent.touches || !event.originalEvent.touches.length) return;
		touchStartX = event.originalEvent.touches[0].clientX;
		touchStartY = event.originalEvent.touches[0].clientY;
	});
	galleryOverlay.on('touchend', function(event) {
		if (touchStartX === null || !event.originalEvent.changedTouches || !event.originalEvent.changedTouches.length) return;
		var endX = event.originalEvent.changedTouches[0].clientX;
		var endY = event.originalEvent.changedTouches[0].clientY;
		var diffX = endX - touchStartX;
		var diffY = endY - touchStartY;
		if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
			if (diffX < 0) stepGallery(1);
			else stepGallery(-1);
		}
		touchStartX = null;
		touchStartY = null;
	});
	$(document).on('keydown', function(event) {
		if (!galleryOverlay.hasClass('is-visible')) return;
		if (event.key === 'Escape') closeGallery();
		if (event.key === 'ArrowLeft') stepGallery(-1);
		if (event.key === 'ArrowRight') stepGallery(1);
	});


	// Isotope portfolio layout disabled for stable fixed grid




	// Slider blocks removed: no matching modules on current homepage

  });
