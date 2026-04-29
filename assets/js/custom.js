
  $(function() {
	'use strict';

  	//Pre-loader
	$(window).on('load', function() {
	 	$('.loader').fadeOut();
		$('.preloader').delay(250).fadeOut('slow');
		$('body').delay(250).css({'overflow':'visible'});
		$('body').addClass('loaded');
	 });

	// 安全兜底：8秒后强制隐藏预加载器（防止某个资源挂起导致页面一直白屏）
	setTimeout(function() {
		if ($('.preloader').is(':visible')) {
			$('.preloader').hide();
			$('body').css({'overflow':'visible'}).addClass('loaded');
		}
	}, 8000);

	
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


	// Smooth page scrolling
	$('a.page-scroll').on('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 700);
		event.preventDefault();
		// 移动端点击后自动收起导航菜单
		$('.navbar-collapse').collapse('hide');
	});


	// Custom fullscreen gallery preview
	var galleryOverlay = $('#galleryOverlay');
	var galleryOverlayImage = $('#galleryOverlayImage');
	var galleryOverlayCounter = $('#galleryOverlayCounter');
	var galleryOverlaySpinner = $('#galleryOverlaySpinner');
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
		galleryOverlayImage.removeClass('is-loaded');
		galleryOverlaySpinner.removeClass('is-hidden');
		galleryOverlayImage.attr('src', full);
		updateGalleryCounter();
		galleryOverlay.addClass('is-visible').attr('aria-hidden', 'false');
		$('body').addClass('gallery-open');
	}

	function closeGallery() {
		galleryOverlay.removeClass('is-visible').attr('aria-hidden', 'true');
		galleryOverlayImage.attr('src', '').removeClass('is-loaded');
		galleryOverlaySpinner.addClass('is-hidden');
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
	galleryOverlayImage.on('load', function() {
		galleryOverlayImage.addClass('is-loaded');
		galleryOverlaySpinner.addClass('is-hidden');
	});
	galleryOverlayImage.on('error', function() {
		galleryOverlaySpinner.addClass('is-hidden');
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
