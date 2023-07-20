/*
Template: Vizion - Data science WordPress landing Page
Author: iqonicthemes.in
Version: 3.5
Design and Developed by: iqonicthemes.in
*/

/*----------------------------------------------
Index Of Script
------------------------------------------------

1.Page Loader
2.Isotope
3.Masonry
4.Slick
5.Swiper
6.Progress Bar
7.Counter
8.Coming soon
6.Timer
7.Back To Top
8.Accordion
9.Magnific Popup
10.Owl Carousel
11.Wow Animation
12.Skrollr
13.Tab

------------------------------------------------
Index Of Script
----------------------------------------------*/
(function (jQuery) {

	"use strict";
	jQuery(document).ready(function () {



			/*------------------------
            Page Loader
            --------------------------*/
			jQuery("#load").fadeOut();
			jQuery("#loader").delay(0).fadeOut("slow");

			/*------------------------
			   Header
			   --------------------------*/
			$('.navbar-nav li a').on('click', function (e) {
				var anchor = $(this);
				$('html, body').stop().animate({
					scrollTop: $(anchor.attr('href')).offset().top - 0
				}, 1500);
				e.preventDefault();
			});

			/*------------------------
			 Header animation and height
			 --------------------------*/

			function headerHeight() {
				var height = jQuery("#main-header").height();
				jQuery('.iq-height').css('height', height + 'px');
			}
			jQuery(function () {
				var header = jQuery("#main-header"),
					yOffset = 0,
					triggerPoint = 80;

				headerHeight();

				jQuery(window).resize(headerHeight);
				jQuery(window).on('scroll', function () {

					yOffset = jQuery(window).scrollTop();

					if (yOffset >= triggerPoint) {
						header.addClass("menu-sticky animated slideInDown");
					} else {
						header.removeClass("menu-sticky animated slideInDown");
					}

				});
			});

			/*------------------------
			    Header add class
			--------------------------*/
			$(document).ready(function () {
				$('.navbar-nav li a').on('click', function () {
					$('.navbar-nav li a.active').removeClass('active');
					$(this).addClass('active');
				});
			});

			/*------------------------
			    Dropdown Menu
			    --------------------------*/

			$(".nav-item.dropdown").mouseenter(function () {
				$(this).addClass("menu-show");
			});

			$(".nav-item.dropdown").mouseleave(function () {
				$(this).removeClass("menu-show");
			});


			/*------------------------
			Toggler Button
			--------------------------*/
			jQuery(document).ready(function () {
				jQuery(".menu-btn").click(function () {
					jQuery(this).toggleClass("is-active");
				});
			});


			/*------------------------
			Isotope
			--------------------------*/
			jQuery('.isotope').isotope({
				itemSelector: '.iq-grid-item',
			});

			/*------------------------------
			filter items on button click
			-------------------------------*/
			jQuery('.isotope-filters').on('click', 'button', function () {
				var filterValue = jQuery(this).attr('data-filter');
				jQuery('.isotope').isotope({
					resizable: true,
					filter: filterValue
				});
				jQuery('.isotope-filters button').removeClass('show active');
				jQuery(this).addClass('show active');
			});


			/*------------------------
			Masonry
			--------------------------*/
			var jQuerymsnry = jQuery('.iq-masonry-block .iq-masonry');
			if (jQuerymsnry) {
				var jQueryfilter = jQuery('.iq-masonry-block .isotope-filters');
				jQuerymsnry.isotope({
					percentPosition: true,
					resizable: true,
					itemSelector: '.iq-masonry-block .iq-masonry-item',
					masonry: {
						gutterWidth: 0
					}
				});
				// bind filter button click
				jQueryfilter.on('click', 'button', function () {
					var filterValue = jQuery(this).attr('data-filter');
					jQuerymsnry.isotope({
						filter: filterValue
					});
				});

				jQueryfilter.each(function (i, buttonGroup) {
					var jQuerybuttonGroup = jQuery(buttonGroup);
					jQuerybuttonGroup.on('click', 'button', function () {
						jQuerybuttonGroup.find('.active').removeClass('active');
						jQuery(this).addClass('active');
					});
				});
			}


			/*------------------------
			Progress Bar
			--------------------------*/
			jQuery('.iq-progress-bar > span').each(function() {
                var jQuerythis = jQuery(this);
                var width = jQuery(this).data('percent');
                jQuerythis.css({
                    'transition': 'width 2s'
                });
                setTimeout(function() {
                    jQuerythis.appear(function() {
                        jQuerythis.css('width', width + '%');
                    });
                }, 500);
            });



			/*----------------
			Counter
			---------------------*/
			jQuery('.timer').countTo();




			/*------------------------
			Back To Top
			--------------------------*/
			jQuery('#back-to-top').fadeOut();
			jQuery(window).on("scroll", function () {
				if (jQuery(this).scrollTop() > 250) {
					jQuery('#back-to-top').fadeIn(1400);
				} else {
					jQuery('#back-to-top').fadeOut(400);
				}
			});

			// scroll body to 0px on click
			jQuery('#top').on('click', function () {
				jQuery('top').tooltip('hide');
				jQuery('body,html').animate({
					scrollTop: 0
				}, 800);
				return false;
			});


			/*------------------------
			Magnific Popup
			--------------------------*/
			jQuery('.popup-gallery').magnificPopup({
				delegate: 'a.popup-img',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function (item) {
						return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
					}
				}
			});


			jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});


			/*------------------------
			Wow Animation
			--------------------------*/
			var wow = new WOW({
				boxClass: 'wow',
				animateClass: 'animated',
				offset: 0,
				mobile: false,
				live: true
			});
			wow.init();


			/*------------------------
			Tabs
			--------------------------*/
			jQuery(window).on('scroll', function (e) {
				var nav = jQuery('#pills-tab');
				if (nav.length) {
					var contentNav = nav.offset().top - window.outerHeight;
					if (jQuery(window).scrollTop() >= (contentNav)) {
						e.preventDefault();
						jQuery('#pills-tab li a').removeClass('active');
						jQuery('#pills-tab li a[aria-selected=true]').addClass('active');
					}
				}
			});
			jQuery(window).on('scroll', function (e) {
				var nav = jQuery('#features');
				if (nav.length) {
					var contentNav = nav.offset().top - window.outerHeight;
					if (jQuery(window).scrollTop() >= (contentNav)) {
						e.preventDefault();
						jQuery('#features .row li a').removeClass('active');
						jQuery('#features .row li a[aria-selected=true]').addClass('active');
					}
				}
			});

			/*---------------------------
			Tabs
			---------------------------*/
			jQuery(document).ready(function () {
				var a = jQuery('.nav.nav-pills').each(function () {
					var b = jQuery(this).find('a.active').attr('href');
					activaTab(b);
				})
			});

			function activaTab(pill) {
				jQuery(pill).addClass('active show');
			};

			/*------------------------
			Circle progress bar
			--------------------------*/
			function animateElements() {

				if ($(".progressbar-circle").length) {

					jQuery('.progressbar-circle').each(function () {
						var elementPos = jQuery(this).offset().top;
						var topOfWindow = jQuery(window).scrollTop();
						var percent = jQuery(this).find('.circle').attr('data-percent');
						var percentage = parseInt(percent, 10) / parseInt(100, 10);
						var animate = jQuery(this).data('animate');
						if (elementPos < topOfWindow + jQuery(window).height() - 30 && !animate) {
							jQuery(this).data('animate', true);
							jQuery(this).find('.circle').circleProgress({
								startAngle: -Math.PI / 2,
								value: percent / 100,
								thickness: 10,
								fill: {
									color: '#6f73f0'
								}
							}).stop();
							jQuery(this).find('.circle.purple-hover').circleProgress({
								fill: {
									color: '#6f73f0'
								}
							});
							jQuery(this).find('.circle.org-hover').circleProgress({
								fill: {
									color: '#ff796d'
								}
							});
							jQuery(this).find('.circle.green-hover').circleProgress({
								fill: {
									color: '#33e2a0'
								}
							});
						}
					});
				}

			}

			// Show animated elements
			animateElements();
			jQuery(window).scroll(animateElements);

			/*------------------------
			   Owl Carousel
			   --------------------------*/
			jQuery('.owl-carousel').each(function () {
				var jQuerycarousel = jQuery(this);
				jQuerycarousel.owlCarousel({
					items: jQuerycarousel.data("items"),
					loop: jQuerycarousel.data("loop"),
					margin: jQuerycarousel.data("margin"),
					nav: jQuerycarousel.data("nav"),
					dots: jQuerycarousel.data("dots"),
					autoplay: jQuerycarousel.data("autoplay"),
					autoplayTimeout: jQuerycarousel.data("autoplay-timeout"),
					navText: ["<i class='fa fa-angle-left fa-2x'></i>", "<i class='fa fa-angle-right fa-2x'></i>"],
					responsiveClass: true,
					responsive: {
						// breakpoint from 0 up
						0: {
							items: jQuerycarousel.data("items-mobile-sm"),
							nav: true,
							dots: false
						},
						// breakpoint from 480 up
						480: {
							items: jQuerycarousel.data("items-mobile"),
							nav: true,
							dots: false
						},
						// breakpoint from 786 up
						768: {
							items: jQuerycarousel.data("items-tab")
						},
						// breakpoint from 1023 up
						1023: {
							items: jQuerycarousel.data("items-laptop")
						},
						1199: {
							items: jQuerycarousel.data("items")
						}
					}
				});
			});




	});
})(jQuery);