(function() {
	'use strict';

	angular
		.module(
			'directives', []
		)
		.directive('note', note)

	;

	function note() {
		return {
			controller: controller,
			controllerAs: '_',
			restrict: 'E',
			scope: {
				note: '=',
			},
			templateUrl: 'templates/note.html',
		};

		function controller($sce, $scope) {
			var vm;

			vm = this;
			vm.note = $scope.note;
			vm.underline = [];
			vm.accidentalsMap = {
				'b': '♭',
				'N': '♮',
				'#': '♯',
			};

			vm.octaves = function(target) {
				if (!vm.note.octaves) {
					return [];
				}

				return vm.note.octaves.split('').filter(
					function(symbol) {
						return symbol === target;
					}
				);
			};

			if (vm.note.accidentals) {
				vm.accidentals = vm.note.accidentals.split('');
			}

			if (vm.note.tempo % 4 === 0) {
				vm.underline.length = Math.log2(vm.note.tempo) - 2;
			}
		}
	}
}());
