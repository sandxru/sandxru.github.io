/*
	Name: unRovr
	Description: Responsive HTML5 vCard Template
	Version: 1.0
	Author: pixelwars
*/


(function ($) {
	"use strict";


	/* global variables */
	var portfolioKeyword = "";
	var porftolioSingleActive = false;
	var porftolioSingleJustClosed = false;
	var soundEffects = false;
	var wind, windReverse, tick;



	/* DOCUMENT LOAD */
	$(function () {


		// ------------------------------
		// SOUND EFFECTS 
		soundEffects = $('html').hasClass('sound-effects');

		if (soundEffects) {
			wind = document.createElement('audio');
			wind.setAttribute('src', $('html').data('audio-wind'));

			windReverse = document.createElement('audio');
			windReverse.setAttribute('src', $('html').data('audio-wind-reverse'));

			tick = document.createElement('audio');
			tick.setAttribute('src', $('html').data('audio-tick'));
		}
		// ------------------------------			


		// SET BG IMAGES
		if ($('.header-wrap > img').length) {
			$('.header').css("background-image", "url(" + $('.header-wrap > img').attr('src') + ")");
		}

		// ------------------------------
		// start loader
		showLoader();
		// ------------------------------


		// ------------------------------
		// ONE PAGE LAYOUT FUNCTIONS
		if ($('html').hasClass('one-page-layout')) {

			// SET BG IMAGES
			var bigImageUrl = $('.cover-media').data('image-url');
			if (bigImageUrl !== undefined) {
				var bigImage = new Image();
				bigImage.src = bigImageUrl;
				bigImage.onload = function () {
					$('html').addClass('is-card-loaded');
					$('.card-3d-right-side, .card-3d-bottom-side').css("background-image", "url(" + bigImageUrl + ")");
					$('.cover-media').css("background-image", "url(" + bigImageUrl + ")").addClass('is-image-loaded');
				};
			}


			// MOBILE HEIGHT FIX
			if (isMobile()) {
				$('.one-page-layout .cover-media').height($(window).height());
				$(window).on('resize', function () {
					$('.one-page-layout .cover-media').height($(window).height());
				});
			}


			// show card
			$('#card-open, .cover-link').on('click', function (event) {
				event.preventDefault();
				showCard();
			});
			// close card
			$('.close-card').on('click', function () {
				$('html').removeClass('is-card-open is-card-opened');
				$('.close-card').removeClass('is-visible');

				// Wind Reverse Sound Effect
				if (soundEffects) {
					windReverse.play();
				}

				closePage();
				return false;
			});


			// add hash to links
			$('.card-nav li').each(function (index, element) {

				var menu_link = $(this).find('a');
				var file_url = menu_link.attr("href");
				var slug = menu_link.data("slug");

				menu_link.attr('href', '#/' + slug);
				menu_link.data('file-url', file_url);

			});



			// PORTFOLIO DETAILS
			// if url contains a portfolio detail url
			portfolioKeyword = $('#portfolio-link').data('slug');


			// SET ACTIVE PAGE - load from hash if exists
			setActivePage();

			// FULL BROWSER BACK BUTTON SUPPORT 
			$.address.change(function () {
				//console.log('addres changed');
				setActivePage();
				var detailUrl = giveDetailUrl();
				if (detailUrl !== -1) {
					showProjectDetails(detailUrl);
				} else {
					// if url contains portfolio keyword
					if ($.address.path().indexOf("/" + portfolioKeyword) !== -1) {
						if (porftolioSingleActive) {
							hideProjectDetails(true, false);
							porftolioSingleJustClosed = false;

							if ($('.card-content').is(':empty')) {
								setActivePage();
							}
						}
					}
				}
			});

		}
		// ------------------------------




		// ------------------------------
		// HEADER FUNCTIONS
		$('.search-toggle').on("click", function () {
			$('html').toggleClass('is-search-toggled-on');
			$(".header-search input").trigger("focus");
		});
		// ------------------------------



		// ------------------------------
		// remove click delay on touch devices
		FastClick.attach(document.body);
		// ------------------------------	



		// ------------------------------
		// BACK TO TOP		
		$("a[href='#card']").on("click", function () {
			$("html, body").animate({ scrollTop: 0 }, 800, "easeInOutExpo");
			return false;
		});
		// ------------------------------



		// ------------------------------
		// DETECT TOUCH DEVICE
		var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		if (isTouch) {
			$('html').addClass('touch');
		} else {
			$('html').addClass('no-touch');
		}
		// ------------------------------



		// ------------------------------
		// Remove no-js class
		$('html').removeClass('no-js');
		// Remove no-js class
		$('html').addClass('ready');
		// ------------------------------



		// ------------------------------
		// SETUP
		setup();
		// ------------------------------




	});
	// DOCUMENT READY




	// WINDOW ONLOAD	 
	$(window).on("load", function () {

		hideLoader();
		$('html').addClass('loaded');

	});
	// WINDOW ONLOAD	





	// ------------------------------
	// ------------------------------
	// FUNCTIONS
	// ------------------------------
	// ------------------------------






	// ------------------------------
	// SETUP : plugins
	function setup() {

		// MASONRY
		setupMasonry();

		// LIGHTBOX
		setupLightbox();

		// FILL SKILL BARS
		fillBars();

		// PORTFOLIO SINGLE AJAX
		setupAjax();

		// FORMS
		setupForms();

		// CONTACT FORM
		setupContactForm();

		// MAP
		setupMap();

		// TABS
		tabs();

		// TOGGLES
		toggles();

		// FLUID MEDIA
		fluidMedia();

	}
	// ------------------------------



	// ------------------------------
	// MOBILE CHECK
	function isMobile() {
		return ($(window).width() < 992);
	}
	// ------------------------------




	// ------------------------------
	// PORTFOLIO SINGLE AJAX
	function setupAjax() {

		// PORTFOLIO DETAILS
		// Show details
		$(".one-page-layout .media-box .ajax, .one-page-layout .portfolio-nav .ajax a").on('click', function (event) {

			event.preventDefault();

			var url = $(this).attr('href');
			var baseUrl = $.address.baseURL();
			var detailUrl = giveDetailUrl();

			if (url.indexOf(baseUrl) !== -1) { // full url
				var total = url.length;
				detailUrl = url.slice(baseUrl.length + 1, total);
				$.address.path('/' + detailUrl);
			} else { // relative url
				detailUrl = url;
				$.address.path(portfolioKeyword + '/' + detailUrl);
			}

		});

	}
	// ------------------------------




	// ------------------------------
	// MASONRY - ISOTOPE
	function setupMasonry() {

		var masonry = $('.masonry, .gallery');
		if (masonry.length) {
			masonry.each(function (index, el) {

				// call isotope
				refreshMasonry();
				$(el).imagesLoaded(function () {
					$(el).isotope({
						layoutMode: $(el).data('layout') ? $(el).data('layout') : 'masonry'
					});
					// set columns
					refreshMasonry();
				});

				// filters
				if (!$(el).data('isotope')) {
					var filters = $(el).siblings('.filters');
					if (filters.length) {
						filters.find('a').on("click", function () {
							var selector = $(this).attr('data-filter');
							$(el).isotope({ filter: selector });
							$(this).parent().addClass('current').siblings().removeClass('current');
							return false;
						});
					}
				}

			}); //each			
			$(window).on('resize debouncedresize', function () {
				setTimeout(function () { refreshMasonry(); }, 100);
			});
		}
	}
	// ------------------------------

	// ------------------------------
	// REFRSH MASONRY - ISOTOPE
	function refreshMasonry() {

		var masonry = $('.masonry');
		if (masonry.length) {
			masonry.each(function (index, el) {

				// check if isotope initialized
				if ($(el).data('isotope')) {

					var itemW = $(el).data('item-width');
					var containerW = $(el).width();
					var items = $(el).children('.hentry');
					var columns = Math.round(containerW / itemW);

					// set the widths (%) for each of item
					items.each(function (index, element) {
						var multiplier = $(this).hasClass('x2') && columns > 1 ? 2 : 1;
						var itemRealWidth = (Math.floor(containerW / columns) * 100 / containerW) * multiplier;
						$(this).css('width', itemRealWidth + '%');
					});

					var columnWidth = Math.floor(containerW / columns);

					$(el).isotope('option', { masonry: { columnWidth: columnWidth } });
					$(el).isotope('layout');
				}

			}); //each
		}

	}
	// ------------------------------



	// ------------------------------
	// LIGHTBOX - applied to porfolio and gallery post format
	function setupLightbox() {

		if ($(".lightbox, .gallery").length) {

			$('.media-box, .gallery').each(function (index, element) {
				var $media_box = $(this);
				$media_box.magnificPopup({
					delegate: '.lightbox, .gallery-item a[href$=".jpg"], .gallery-item a[href$=".jpeg"], .gallery-item a[href$=".png"], .gallery-item a[href$=".gif"]',
					type: 'image',
					image: {
						markup: '<div class="mfp-figure">' +
							'<div class="mfp-close"></div>' +
							'<div class="mfp-img"></div>' +
							'</div>' +
							'<div class="mfp-bottom-bar">' +
							'<div class="mfp-title"></div>' +
							'<div class="mfp-counter"></div>' +
							'</div>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button

						cursor: 'mfp-zoom-out-cur', // Class that adds zoom cursor, will be added to body. Set to null to disable zoom out cursor. 
						verticalFit: true, // Fits image in area vertically
						tError: '<a href="%url%">The image</a> could not be loaded.' // Error message
					},
					gallery: {
						enabled: true,
						tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
					},
					iframe: {
						markup: '<div class="mfp-iframe-scaler">' +
							'<div class="mfp-close"></div>' +
							'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
							'<div class="mfp-title">Some caption</div>' +
							'</div>'
					},
					mainClass: 'mfp-zoom-in',
					tLoading: '',
					removalDelay: 300, //delay removal by X to allow out-animation
					callbacks: {
						markupParse: function (template, values, item) {
							var title = "";
							if (item.el.parents('.gallery-item').length) {
								title = item.el.parents('.gallery-item').find('.gallery-caption').text();
							} else {
								title = item.el.data('title') == undefined ? "" : item.el.data('title');
							}
							//return title;
							values.title = title;

						},
						imageLoadComplete: function () {
							var self = this;
							setTimeout(function () {
								self.wrap.addClass('mfp-image-loaded');
							}, 16);
						},
						close: function () {
							this.wrap.removeClass('mfp-image-loaded');
						},
						beforeAppend: function () {

							var self = this;

							// square aspect ratio for soundcloud embeds
							if (this.content.find('iframe[src*="soundcloud.com"]').length) {
								self.wrap.addClass('is-soundcloud');
							} else {
								self.wrap.removeClass('is-soundcloud');
							}

							this.content.find('iframe').on('load', function () {
								setTimeout(function () {
									self.wrap.addClass('mfp-image-loaded');
								}, 16);
							});

						}
					},
					closeBtnInside: false,
					closeOnContentClick: true,
					midClick: true
				});
			});
		}

	}
	// ------------------------------


	// ------------------------------
	// FILL PROGRESS BARS
	function fillBars() {

		var bar = $('.bar');
		if (bar.length) {
			$('.bar').each(function () {
				var bar = $(this);
				var percent = bar.attr('data-percent');
				bar.find('.progress').css('width', percent + '%').html('<span>' + percent + '</span>');
			});
		}

	}
	// ------------------------------	


	// ------------------------------
	// TABS
	function tabs() {

		var tabs = $('.tabs');
		if (tabs.length) {

			$('.tabs').each(function () {
				if (!$(this).find('.tab-titles li a.active').length) {
					$(this).find('.tab-titles li:first-child a').addClass('active');
					$(this).find('.tab-content > div:first-child').show();
				} else {
					$(this).find('.tab-content > div').eq($(this).find('.tab-titles li a.active').parent().index()).show();
				}
			});

			$('.tabs .tab-titles li a').on("click", function () {
				if ($(this).hasClass('active')) { return; }
				$(this).parent().siblings().find('a').removeClass('active');
				$(this).addClass('active');
				$(this).parents('.tabs').find('.tab-content > div').hide().eq($(this).parent().index()).show();
				return false;
			});

		}

	}
	// ------------------------------	


	// ------------------------------
	// TOGGLES
	function toggles() {

		if ($('.toggle').length) {

			var toggleSpeed = 300;
			$('.toggle h4.active + .toggle-content').show();

			$('.toggle h4').on("click", function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					$(this).next('.toggle-content').stop(true, true).slideUp(toggleSpeed);
				} else {

					$(this).addClass('active');
					$(this).next('.toggle-content').stop(true, true).slideDown(toggleSpeed);

					//accordion
					if ($(this).parents('.toggle-group').hasClass('accordion')) {
						$(this).parent().siblings().find('h4').removeClass('active');
						$(this).parent().siblings().find('.toggle-content').stop(true, true).slideUp(toggleSpeed);
					}

				}
				return false;
			});

		}

	}
	// ------------------------------	


	// ------------------------------
	// FLUID MEDIA
	function fluidMedia() {

		if ($('iframe,video').length) {
			$("html").fitVids();
		}

	}
	// ------------------------------


	// ------------------------------
	// SETUP FORMS : FORM VALIDATION
	function setupForms() {

		// comment form validation fix
		if ($('#commentform').length) {

			$('#commentform').addClass('validate-form');
			$('#commentform').find('input,textarea').each(function (index, element) {
				if ($(this).attr('aria-required') == "true") {
					$(this).addClass('required');
				}
				if ($(this).attr('name') == "email") {
					$(this).addClass('email');
				}
			});
		}

		// mailchimp form validation fix
		var mailchimpForm = $('.mc4wp-form form');
		if (mailchimpForm.length) {
			mailchimpForm.addClass('validate-form');
		}

		// validate form
		if ($('.validate-form').length) {
			$('.validate-form').each(function () {
				$(this).validate();
			});
		}

	}
	// ------------------------------	


	// ------------------------------
	// SETUP CONTACT FORM
	function setupContactForm() {

		var contactForm = $('#contact-form');
		if (contactForm.length) {

			var $alert = $('.site-alert');
			var $submit = contactForm.find('.submit');



			contactForm.on("submit", function () {
				if (contactForm.valid()) {
					NProgress.start();
					$submit.addClass("active loading");
					var formValues = contactForm.serialize();

					$.post(contactForm.attr('action'), formValues, function (data) {
						if (data == 'success') {
							contactForm.clearForm();
						}
						else {
							$alert.addClass('error');
						}
						NProgress.done();
						$alert.show();
						setTimeout(function () { $alert.hide(); }, 6000);
					});
				}
				return false;
			});

			$.fn.clearForm = function () {
				return this.each(function () {
					var type = this.type, tag = this.tagName.toLowerCase();
					if (tag == 'form')
						return $(':input', this).clearForm();
					if (type == 'text' || type == 'password' || tag == 'textarea')
						this.value = '';
					else if (type == 'checkbox' || type == 'radio')
						this.checked = false;
					else if (tag == 'select')
						this.selectedIndex = -1;
				});
			};
		}

	}
	// ------------------------------


	// ------------------------------
	// SETUP MAP : GOOGLE MAP
	/*
		custom map with google api
		check out the link below for more information about api usage
		https://developers.google.com/maps/documentaztion/javascript/examples/marker-simple
		
	*/
	function setupMap() {

		var mapCanvas = $('#map-canvas');

		if (mapCanvas.length) {
			var latitude = mapCanvas.data("latitude");
			var longitude = mapCanvas.data("longitude");
			var zoom = mapCanvas.data("zoom");
			var marker_image = mapCanvas.data("marker-image");

			// Basic options for a simple Google Map
			// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
			var mapOptions = {

				// How zoomed in you want the map to start at (always required)
				zoom: zoom,

				// disable zoom controls
				disableDefaultUI: true,

				// The latitude and longitude to center the map (always required)
				center: new google.maps.LatLng(latitude, longitude),

				// How you would like to style the map. 
				// custom map styles from : https://snazzymaps.com/
				// This is where you would paste any style found on Snazzy Maps.
				styles: [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "on" }, { "lightness": 33 }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2e5d4" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#c5dac6" }] }, { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 20 }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#c5c6c6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#e4d7c6" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#fbfaf7" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#acbcc9" }] }]
			};

			// Get the HTML DOM element that will contain your map 
			// We are using a div with id="map" seen below in the <body>
			var mapElement = document.getElementById('map-canvas');
			//var mapElement = $('#map-canvas');
			//var myLatlng = new google.maps.LatLng(mapElement.data("latitude"),mapElement.data("longitude"));

			// Create the Google Map using our element and options defined above
			var map = new google.maps.Map(mapElement, mapOptions);

			//CREATE A CUSTOM PIN ICON
			var marker_image = marker_image;
			var pinIcon = new google.maps.MarkerImage(marker_image, null, null, null, new google.maps.Size(120, 90));

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				map: map,
				icon: pinIcon,
				title: 'Hey, I am here'
			});
		}

	}
	// ------------------------------	




	// ------------------------------
	// AJAX PORTFOLIO DETAILS
	var pActive;

	function showProjectDetails(url) {


		porftolioSingleJustClosed = true;
		porftolioSingleActive = true;

		showLoader();

		var p = $('.p-overlay:not(.active)').first();
		pActive = $('.p-overlay.active');

		// ajax : fill data
		p.empty().load(url + ' .portfolio-single', function () {

			NProgress.set(0.5);

			// wait for images to be loaded
			p.imagesLoaded(function () {

				hideLoader();

				if (pActive.length) {
					hideProjectDetails();
				}

				$('html').addClass('p-overlay-on');
				//$("body").scrollTop(0);

				// setup plugins
				setup();

				$('html').addClass('p-animating');

				// Play Sound Effect
				if (soundEffects) {
					tick.play();
				}

				p.removeClass('animate-in animate-out').addClass('animate-in').show();
				p.addClass('active');



				p.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
					function (e) {
						$('html').removeClass('p-animating');
					});



			});
		});
	}

	function hideProjectDetails(forever, safeClose) {

		porftolioSingleJustClosed = true;

		// Play Sound Effect
		if (soundEffects) {
			tick.play();
		}

		$('html').addClass('p-animating');

		// close completely by back link.
		if (forever) {
			pActive = $('.p-overlay.active');

			$('html').removeClass('p-overlay-on');

			if (!safeClose) {
				// remove detail url
				$.address.path(portfolioKeyword);
			}
		}

		pActive.removeClass('active animate-in animate-out').addClass('animate-out').show();


		pActive.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
			function (e) {
				$('html').removeClass('p-animating');
				pActive.hide().removeClass('animate-out').empty();
			});

		setTimeout(function () { pActive.hide().removeClass('animate-out').empty(); }, 550);

	}

	function giveDetailUrl() {

		var address = $.address.value();
		var detailUrl;

		if (address.indexOf("/" + portfolioKeyword + "/") != -1 && address.length > portfolioKeyword.length + 2) {
			var total = address.length;
			detailUrl = address.slice(portfolioKeyword.length + 2, total);
		} else {
			detailUrl = -1;
		}
		return detailUrl;
	}
	// ------------------------------



	// ------------------------------
	// AJAX LOADER
	function showLoader() {
		NProgress.start();
	}
	function hideLoader() {
		NProgress.done();
	}
	// ------------------------------



	// ------------------------------
	// SET ACTIVE PAGE
	function setActivePage() {

		var path = $.address.path();
		path = path.slice(1, path.length);

		// if hash tag doesnt exists - close page
		if (path === "") {
			closePage();
		}
		else { // show page change animation
			// change page only if url doesn't target portfolio single page
			//console.log(porftolioSingleJustClosed);

			if (porftolioSingleJustClosed) {
				porftolioSingleJustClosed = false;
			} else {
				if (giveDetailUrl() === -1) {
					//porftolioSingleJustClosed = false;
					var new_url = $('a[data-slug=' + path + ']').data('file-url');
					showPage(new_url);
				}
			}


			showCard();
		}

		setCurrentMenuItem();

	}
	// ------------------------------



	// ------------------------------
	// SET CURRENT MENU ITEM
	function setCurrentMenuItem() {
		var activePageId = ($.address.path());
		// set default nav menu
		//console.log(activePageId);
		if (activePageId !== "/") {
			$('.card-nav a[href="#' + activePageId + '"]').parent().addClass('current_page_item').siblings().removeClass('current_page_item');
		} else {
			$('.card-nav li').removeClass('current_page_item');
		}
	}
	// ------------------------------


	// ------------------------------	
	// SHOW CARD
	function showCard() {

		var mq = window.getComputedStyle(document.querySelector('.card-intro'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
		if (mq === 'mobile') {
			$('body,html').animate({ 'scrollTop': $('#card').offset().top }, 200);
		} else {
			if (!$('html').hasClass('is-card-open')) {
				$('html').addClass('is-card-open');
				$('.card-layout').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
					$('.close-card').addClass('is-visible');
					$('html').addClass('is-card-opened');
					setup();
				});

				// Wind Sound Effect
				if (soundEffects && !(isMobile())) {
					wind.play();
				}
			}
		}
	}
	// ------------------------------	




	// ------------------------------	
	// SHOW PAGE
	function showPage(url) {

		showLoader();

		// Play Sound Effect
		if (soundEffects) {
			tick.play();
		}

		/* OPEN PANEL : load and show new content */
		var cardContent = $('.card-content');
		cardContent.removeClass('is-loaded').addClass('is-changing');

		$("html").addClass('is-ajax-page-active');

		var mq = window.getComputedStyle(document.querySelector('.card-intro'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
		if (mq !== 'mobile') {
			//$("html, body").animate({ scrollTop: $('.card-nav').offset().top - 20 }, 400);
		}


		// only jquery get() returns remote page's <head> content
		jQuery.get(url, function (data) {

			$("html").addClass('is-ajax-page-loaded');

			// clear container content
			cardContent.empty();

			// elementor inline styles
			cardContent.append($(data).filter('#elementor-frontend-inline-css'));
			// elementor external styles
			cardContent.append($(data).filter("link[id^='elementor-post-']"));
			// elementor common styles
			cardContent.append($(data).filter("link[id='elementor-frontend-css']"));

			// put page content
			cardContent.append($(data).find('.page-single > .hentry'));

			// wait for images to be loaded
			cardContent.imagesLoaded(function () {

				hideLoader();
				cardContent.removeClass('is-changing');
				cardContent.addClass('is-loaded');
				setup();

				// fix masonry after card grow animation ended
				setTimeout(function () { setup(); }, 400);
			});


		});

	}

	// CLOSE PAGE
	function closePage() {

		$('.card-content').empty();
		$.address.path('');
		history.pushState("", document.title, window.location.pathname);
		$("html").removeClass('is-ajax-page-loaded is-ajax-page-active');

	}
	// ------------------------------





})(jQuery);