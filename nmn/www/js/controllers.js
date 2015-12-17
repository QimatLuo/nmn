(function() {
	'use strict';

	angular
		.module(
			'controllers', []
		)
		.controller('SideMenu', SideMenu)
		.controller('Test', Test)

	;

	function SideMenu(
		nmn,
		$ionicPopup,
		$ionicSideMenuDelegate
	) {
		var vm;

		vm = this;
		vm.nmn = nmn;

		if (!localStorage.length) {
			localStorage['First example'] = '{"bpm":60,"pitch":0,"tab":[{"a":"","d":0,"n":1,"o":1,"t":8},{"a":"","d":0,"n":7,"o":0,"t":8},{"a":"♯","d":0,"n":6,"o":0,"t":8},{"a":"","d":0,"n":0,"o":0,"t":8},{"a":"♯","d":0,"n":5,"o":0,"t":8},{"a":"","d":0,"n":5,"o":0,"t":8},{"a":"♯","d":0,"n":4,"o":0,"t":8},{"a":"","d":0,"n":4,"o":0,"t":8},{"a":"","d":0,"n":3,"o":0,"t":8},{"a":"♯","d":0,"n":2,"o":0,"t":8},{"a":"","d":0,"n":2,"o":0,"t":8},{"a":"♯","d":0,"n":1,"o":0,"t":8},{"a":"","d":0,"n":1,"o":0,"t":8},{"a":"","d":0,"n":7,"o":-1,"t":8},{"a":"","d":0,"n":6,"o":-1,"t":8}]}';
		}
		vm.list = localStorage;

		vm.confirm = function(method) {
			$ionicPopup.confirm({
					title: 'Are you sure to <b class="assertive">' + method + '</b> this notation?',
				})
				.then(
					function(res) {
						if (!res) return;

						vm[method.toLowerCase()]();

						$ionicSideMenuDelegate.toggleRight();
					}
				);
		};

		vm.delete = function() {
			localStorage.removeItem(nmn.settings.name);
		};

		vm.load = function() {
			for (var name in localStorage) {
				nmn.setup(name, localStorage[name]);
				vm.name = nmn.settings.name;
				break;
			}
		};

		vm.minus = function(key) {
			vm.nmn.settings[key]--;
		};

		vm.plus = function(key) {
			vm.nmn.settings[key]++;
		};

		vm.save = function() {
			if (vm.name !== nmn.settings.name) {
				vm.delete();
			}

			localStorage.setItem(vm.name, JSON.stringify({
				bpm: nmn.settings.bpm,
				pitch: nmn.settings.pitch,
				tab: nmn.tab,
			}));

			nmn.settings.name = vm.name;
		};

		vm.select = function(name) {
			nmn.setup(name, vm.list[name]);
			vm.name = nmn.settings.name;
			nmn.index = 0;
		};

		vm.load();
	}

	function Test(
		nmn,
		$scope
	) {
		var vm;

		vm = this;
		vm.nmn = nmn;
		vm.note = {
			a: '',
			d: 0,
			n: 0,
			o: 0,
			t: 4,
		};

		vm.add = function(pos) {
			nmn.tab.splice(nmn.index + pos, 0, angular.copy(vm.note));
			nmn.index += pos;

			if (
				nmn.index < 0 ||
				nmn.index >= nmn.tab.length
			) {
				nmn.index = 0;
			}
		};

		vm.play = function() {
			if (!nmn.playing) {
				nmn.play();
			} else {
				nmn.stop();
			}
		};

		vm.remove = function() {
			nmn.tab.splice(nmn.index, 1);
			if (nmn.index > 0) {
				nmn.index--;
			}
		};

		vm.test = function(num) {
			nmn.stop();
			vm.note.n = num;

			if (num === 0) return;

			nmn.playNote(vm.note);
		};

		nmn.onended = function(oscillator) {
			$scope.$digest();
		};
	}
}());
