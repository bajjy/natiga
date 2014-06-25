// lucuma tiene los modulos externales que usamos, safeApply y timeFunctions

var app = angular.module('natigapp',[]); 

app.controller('MainCtrl', function ($scope, $http) {  
});

app.directive('natiga', ['$compile',
	function(compile) {
		return {
			restrict: 'E',
			scope: {},
			replace: true,
			link: function(scope, element, attrs) {
				var ell;
				var imgsholders;
				scope.natslides = [];
				scope.natigaPos = 0;

				for (var i = 0; i < element.find('img').length; i++) {
					scope.natslides.push(element.find('img')[i]);
				}

				var natigainit = function() {
					ell = angular.element(document.querySelector('.natiga .holder'));
					imgsholders = angular.element(document.querySelectorAll('.natiga li'));
				}
				scope.elWidth = function() {
					return {
						width: angular.element(document.querySelector('.natiga')).innerWidth()
					}
				}
				scope.roll = function(el) {
					var startX = event.clientX;
					var startY = event.clientY;
					ell = angular.element(document.querySelector('.natiga .holder'));

					var dragme = function() {
						if (!isTouch()) {
							ell[0].scrollLeft -= Math.round((startX - event.clientX));
							ell[0].ondragstart = function() {
								return false;
							};
							scope.$apply(function() {
								scope.styles = {
									'cursor': 'move'
								}
							})
						}
					}

					window.addEventListener('mousemove', dragme);
					window.addEventListener('mouseup', function() {
						window.removeEventListener("mousemove", dragme, false);
						scope.$apply(function() {
							scope.styles = {
								'cursor': 'default'
							}
						});
					});
				}
				scope.nextback = function(targ) {
					natigainit();
					var acc = 20;
					var intervalListener = self.setInterval(function() {
						line()
					}, 0.5);

					var line = function() {
						if (ell[0].scrollLeft != Math.abs(imgsholders[targ].offsetLeft)) {
							ell[0].scrollLeft -= (ell[0].scrollLeft - imgsholders[targ].offsetLeft) / acc > 0 ? (ell[0].scrollLeft - imgsholders[targ].offsetLeft) / acc : (ell[0].scrollLeft - (imgsholders[targ].offsetLeft + acc)) / acc;
						} else {
							window.clearInterval(intervalListener);
						}
					}
				}

				var htmlText = '<div class="natiga">' +
					'<div class="holder" ng-click="">' +
					'<ul style="width:{{natslides.length*elWidth().width}}px;" ng-mousedown="roll(this)" ng-style="styles">' +
					'<li ng-repeat="slide in natslides" ng-style="elWidth()">' + //style="width:{{elWidth}}px;"
				'<img src="{{slide.attributes.source.value}}" alt="image">' +
					'</li>' +
					'<ul>' +
					'<div/>' +
					'<div/>';

				element.html(compile(htmlText)(scope));

				window.addEventListener('resize', function() {
					scope.$apply(function() {
						scope.elWidth();
					})
				});
			}
		}
	}
])

var isTouch = function() {
return 'ontouchstart' in window // works on most browsers 
|| 'onmsgesturechange' in window; // works on ie10
}