// Singleton WWO-API JavaScript SDK
SDK = window.SDK || {};

SDK.Weather = (function () {
	var _baseUrl = 'http://api.worldweatheronline.com/',
		_type = 'free',
		_page = '/v1/weather.ashx',
		_key = '6fubz25shqbwdvgzdt98s8dn';

	return {
		setBaseUrl: function (baseUrl) {
			_baseUrl = String(baseUrl);
		},
		setKey: function (key) {
			_key = String(key);
		},
		setType: function (type) {
			if (type === 'free' || type === 'premium') {
				_type = type;
			}
		},
		setPage: function (page) {
			_page = String(page);
		},
		load: function (config) {
			config = $.extend({
				'location': 'London',
				'format': 'json',
				'dataType': 'json',
				'days': 1,
				'location': true,
				'comments': false,
				'callback': function () {},
				'scope': this
			}, config);

			var url = _baseUrl + _type + _page,
				data = {
					key: _key,
					q: config.location,
					format: config.format,
					num_of_days: config.days,
					includelocation: (config.location === true ? 'yes' : 'no'),
					show_comments: (config.comments === true ? 'yes' : 'no')
				};

			$.ajax({
				url: url,
				type: 'get',
				data: data,
				dataType: config.dataType,
				crossDomain: true
			}).done(function (response, status, XHR) {
				config.callback.apply(config.scope, [true, response, status, XHR]);
			}).fail(function (XHR, status, error) {
				config.callback.apply(config.scope, [false, error, status, XHR]);
			});
		}
	}
})();

window.jQuery(function ($) {
	if (!'ColorMix' in window) {
		throw new Error('The ColorMix is required.');
	}

	var $appTitle = $('#app-title'),
		$form = $('form#form-mix'),
		$averageMixingFirstColor = $('#average-mixing-color-1').val('#ffffff').css('background-color', '#ffffff'),
		$averageMixingSecondColor = $('#average-mixing-color-2').val('#000000').css('background-color', '#000000'),
		$mix = $('#color-mix'),
		mixColors = function () {
			var c1 = new ColorMix.Color($averageMixingFirstColor.val()),
				c2 = new ColorMix.Color($averageMixingSecondColor.val()),
				mix = ColorMix.mix([c1, c2], [50, 50]);

			mix.useAsBackground($mix.selector);
			$mix.empty().append($('<div>', {
				'class': 'color-1'
			}).css('background-color', $averageMixingFirstColor.val())).append($('<div>', {
				'class': 'color-2'
			}).css('background-color', $averageMixingSecondColor.val())).append($('<div>', {
				'class': 'color-values-container'
			}).append($('<div>', {
				'class': 'color-value-rgb'
			}).text(mix.toString('rgb'))).append($('<div>', {
				'class': 'color-value-hsl'
			}).text(mix.toString('hsl'))).append($('<div>', {
				'class': 'color-value-hex'
			}).text(mix.toString('hex'))));
		},
		$gradientFirstColor = $('#gradient-color-1').val('#ffffff').css('background-color', '#ffffff'),
		$gradientSecondColor = $('#gradient-color-2').val('#000000').css('background-color', '#000000'),
		$gradient = $('#gradient'),
		gradientise = function () {
			var c1 = new ColorMix.Color($gradientFirstColor.val()),
				c2 = new ColorMix.Color($gradientSecondColor.val());
			ColorMix.setGradient([{
				'reference': 0,
				'color': c1
			}, {
				'reference': 11,
				'color': c2
			}]);
			$('.gradient-step', '#gradient').each(function (i, gradientStep) {
				ColorMix.blend(i).useAsBackground($(this));
			});
		},
		backgroundIndice = 0,
		direction = 'up',
		referenceMax = 250,
		reference = referenceMax,
		$slider = $('#speed-slider'),
		$background = $('#background-color'),
		backgroundise = function(reference) {
			var c1, c2, gradient;
			c1 = new ColorMix.Color($gradientFirstColor.val());
			c2 = new ColorMix.Color($gradientSecondColor.val());
			gradient = [
				{
					'reference': 0,
					'color': c1
				}, {
					'reference': reference,
					'color': c2
				}
			];
			ColorMix.setGradient(gradient);
			ColorMix.blend(backgroundIndice).useAsBackground($background);
			backgroundIndice += direction === 'up' ? 1 : -1;
			if (backgroundIndice > gradient[gradient.length - 1].reference) {
				direction = 'down';
			}
			if (backgroundIndice === 0) {
				return direction = 'up';
			}
		},
		$weatherWidget = $('#widget-weather'),
		$weatherButton = $('#weather-button'),
		WeatherWidget = function (target) {
			var $target = $(target),
				_location = 'London',
				_data = {},
				resetGradient = function() {
					if (ColorMix) {
						ColorMix.setGradient([
							{ reference: -30, color: { red: 123, green: 219, blue: 243 } },
							{ reference: -27.5, color: { red: 124, green: 217, blue: 238 } },
							{ reference: -25, color: { red: 128, green: 214, blue: 233 } },
							{ reference: -22.5, color: { red: 128, green: 214, blue: 233 } },
							{ reference: -20, color: { red: 136, green: 207, blue: 219 } },
							{ reference: -17.5, color: { red: 141, green: 203, blue: 212 } },
							{ reference: -15, color: { red: 146, green: 204, blue: 243 } },
							{ reference: -12.5, color: { red: 151, green: 194, blue: 195 } },
							{ reference: -10, color: { red: 157, green: 190, blue: 187 } },
							{ reference: -7.5, color: { red: 162, green: 186, blue: 178 } },
							{ reference: -5, color: { red: 169, green: 180, blue: 168 } },
							{ reference: -2.5, color: { red: 175, green: 175, blue: 159 } },
							{ reference: 0, color: { red: 181, green: 171, blue: 149 } },
							{ reference: 2.5, color: { red: 187, green: 166, blue: 139 } },
							{ reference: 5, color: { red: 193, green: 161, blue: 130 } },
							{ reference: 7.5, color: { red: 199, green: 156, blue: 121 } },
							{ reference: 10, color: { red: 205, green: 151, blue: 112 } },
							{ reference: 12.5, color: { red: 210, green: 147, blue: 103 } },
							{ reference: 15, color: { red: 216, green: 142, blue: 94 } },
							{ reference: 17.5, color: { red: 221, green: 138, blue: 86 } },
							{ reference: 20, color: { red: 226, green: 134, blue: 79 } },
							{ reference: 22.5, color: { red: 230, green: 131, blue: 72 } },
							{ reference: 25, color: { red: 234, green: 127, blue: 66 } },
							{ reference: 27.5, color: { red: 238, green: 124, blue: 60 } },
							{ reference: 30, color: { red: 241, green: 122, blue: 55 } }
						]);
						var length = $('.gradient-step', '#temperature-gradient').length;
						$('.gradient-step', '#temperature-gradient').each(function (i, gradientStep) {
							var reference = (i - (length - 1) / 2) * (30 / ((length - 1) / 2));
							ColorMix.blend(reference).useAsBackground($(this));
						});
					}
				},
				init = function () {
					resetGradient.apply(this);
					load.apply(this);
				},
				load = function () {
					var weather = this;
					SDK.Weather.load({
						dataType: 'jsonp',
						location: _location,
						callback: function (success, response, status, XHR) {
							if (success) {
								_data = response.data;
								displayWeather.apply(weather);
							} else {
								// Hummm...
								console.error('Impossible to load the weather widget data from the API.');
							}
						},
						scope: this
					});
				},
				move = function() {
					var gradient, i, x;
					x = 0;
					gradient = ColorMix.getGradient();
					i = gradient.length;
					while (i--) {
						if (_data.current_condition[0].temp_C <= gradient[i].reference) {
							x++;
						} else {
							break;
						}
					}
					x = (1 - 1 * x / gradient.length) * $target.parent().width() - $target.width() / 2;
					return $target.css({
						'transform': 'translate3d(' + x + 'px, 0, 0)',
						'-o-transform': 'translate3d(' + x + 'px, 0, 0)',
						'-ms-transform': 'translate3d(' + x + 'px, 0, 0)',
						'-moz-transform': 'translate3d(' + x + 'px, 0, 0)',
						'-webkit-transform': 'translate3d(' + x + 'px, 0, 0)'
					});
				},
				displayWeather = function () {
					resetGradient.apply(this);
					move.apply(this);
					if ($target.length > 0) {
						$target.empty().append($('<div>', {
							'class': 'widget-weather-location'
						}).text(_location)).append($('<div>', {
							'class': 'widget-weather-temperature'
						}).text(_data.current_condition[0].temp_C + ' °C')).append($('<div>', {
							'class': 'widget-weather-informations'
						}).append($('<div>', {
							'class': 'widget-weather-wind'
						}).append($('<div>', {
							'class': 'widget-weather-wind-container'
						}).append($('<span>', {
							'class': 'widget-weather-wind-value'
						}).text(_data.current_condition[0].windspeedKmph + ' km/h')))).append($('<div>', {
							'class': 'widget-weather-humidity'
						}).append($('<div>', {
							'class': 'widget-weather-humidity-container'
						}).append($('<span>', {
							'class': 'widget-weather-humidity-value'
						}).text(_data.current_condition[0].humidity + ' %'))))).css('backgroundColor', ColorMix.blend(_data.current_condition[0].temp_C).toString('rgb'));
					}
				};

			return {
				init: function () {
					init.apply(this);
					return this;
				},
				setLocation: function (location) {
					_location = String(location);
					load.apply(this);
					return this;
				}
			}
		},
		Weather = (new WeatherWidget($weatherWidget)).init();

	prettyPrint();

	ColorMix.setGradient([{
		'reference': 0,
		'color': new ColorMix.Color(0, 179, 255)
	}, {
		'reference': 7,
		'color': new ColorMix.Color(255, 61, 0)
	}])

	$appTitle.find('.character').each(function (i, character) {
		ColorMix.blend(i).useAsColor($(this));
	});

	gradientise();

	$averageMixingFirstColor.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			mixColors();
		}
	});

	$averageMixingSecondColor.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			mixColors();
		}
	});

	$gradientFirstColor.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			gradientise();
		}
	});

	$gradientSecondColor.colorpicker().on({
		changeColor: function (e) {
			$(this).val(e.color.toHex()).css('background-color', e.color.toHex());
			gradientise();
		}
	});

	$slider.on('change', function(event, result) {
		reference = (referenceMax - this.value * referenceMax / 100) / 2 + 125;
	});

	if ($background.length > 0) {
		var onFrame = function () {
			backgroundise(reference);
			requestAnimationFrame(onFrame);
		}

		requestAnimationFrame(onFrame);
	}

	$form.on({
		submit: function (event) {
			event.preventDefault();

			if ($averageMixingFirstColor.val() && $averageMixingSecondColor.val()) {
				mixColors();
			}
		}
	}).submit();

	$weatherButton.on({
		click: function (event) {
			event.preventDefault();

			var $btn = $(this);
			$btn.button('loading');

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					$btn.button('reset');
					Weather.setLocation(String(position.coords.latitude + ',' + position.coords.longitude));
				}, function (error) {
					$btn.button('reset');
					var message = 'It was impossible to retrieve your position because : ';
					switch (error.code) {
						case 1:
							message += 'the permission is denied.';
							break;
						case 2:
							message += 'the position is unavailable.';
							break;
						case 3:
							message += 'it was too long to retrieve.';
							break;
						default:
							message += 'an unknown error happened.'
							break;
					}
					alert(message);
				});
			} else {
				alert('Your browser seems to not be able to use the Geolocation. Please update it, or change for a modern browser !');
			}
		}
	})
});
