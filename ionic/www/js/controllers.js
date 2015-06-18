(function() {
	'use strict';

	angular
		.module(
			'controllers', []
		)
		.controller('Home', Home)
		.controller('SideMenu', SideMenu)

	;

	function Home(G, Sheet, $ionicActionSheet, $ionicPopup) {
		var vm;

		vm = this;
		vm.G = G;
		vm.Sheet = Sheet;

		vm.changeIndex = function(type) {
			if (typeof type === 'number') {
				Sheet.playIndex = type;
				return;
			}

			switch (type) {
				case 'end':
					Sheet.playIndex = Sheet.raw.length - 1;
					break;
				case 'next':
					Sheet.playIndex++;
					break;
				case 'prev':
					Sheet.playIndex--;
					break;
				case 'start':
					Sheet.playIndex = 0;
					break;
			}
		};

		vm.edit = function(type, value) {
			var note;

			note = Sheet.raw[Sheet.playIndex];

			switch (type) {
				case 'num':
				case 'tempo':
					note[type] = value;
					break;
				case 'octaves':
				case 'accidentals':
					if (
						note[type] &&
						note[type].indexOf(value) !== -1
					) {
						note[type] += value;
					} else {
						note[type] = value;
					}
					break;
				case 'add':
					if (note) {
						Sheet.raw.splice(Sheet.playIndex, 0, angular.copy(note));
					} else {
						Sheet.raw.push({
							num: 1,
							tempo: 4,
						});
					}

					if (value === 'after') {
						Sheet.playIndex++;
					}
					break;
				case 'remove':
					Sheet.raw.splice(Sheet.playIndex, 0);
					break;
				case 'reset':
					note.num = 0;
					delete note.accidentals;
					delete note.octaves;
					break;
			}
		};

		vm.play = function() {
			if (Sheet.isPlaying) {
				Sheet.stop();
			} else {
				Sheet.play();
			}
		};
	}

	function SideMenu(G, Sheet, $ionicPopup) {
		var vm;

		vm = this;
		vm.G = G;
		vm.Sheet = Sheet;
		vm.sheets = [];

		vm.addSheet = function() {
			G.sheetId = new Date().toJSON();
			G.editing = true;
			Sheet.raw.length = 0;
			Sheet.playIndex = 0;

			angular.extend(
				Sheet.settings, {
					beat: {
						denominator: 4,
						numerator: 4
					},
					bpm: 120,
					frequency: 440,
					key: {
						name: 'C',
						symbol: '',
					},
					title: G.sheetId,
				}
			);
		};

		vm.delete = function() {
			$ionicPopup.confirm({
					template: 'Are you sure?',
					title: 'Warning',
				})
				.then(
					function(res) {
						if (!res) {
							return;
						}

						delete localStorage[G.sheetId];
						delete G.sheetId;
						vm.getSheets();
					}
				);
		};

		vm.getSheets = function() {
			vm.sheets = [];

			Object.keys(localStorage).forEach(
				function(key) {
					vm.sheets.push({
						json: localStorage[key],
						name: key,
					});
				}
			);
		};

		vm.save = function() {
			if (!G.editing) {
				G.editing = true;
				return;
			}

			if (G.sheetId !== Sheet.settings.title) {
				if (localStorage[Sheet.settings.title]) {
					$ionicPopup.alert({
						template: 'Title already exist',
						title: 'Error',
					});
					return;
				}
				delete localStorage[G.sheetId];
			}

			localStorage[Sheet.settings.title] = angular.toJson({
				raw: Sheet.raw,
				settings: Sheet.settings,
			});

			G.sheetId = Sheet.settings.title;

			$ionicPopup.alert({
					title: 'Success',
				})
				.then(vm.getSheets);
		};

		vm.setTitle = function() {
			$ionicPopup.prompt({
					subTitle: Sheet.settings.title,
					title: 'Set Title',
				})
				.then(
					function(text) {
						if (text !== undefined) {
							Sheet.settings.title = text;
						}
					}
				);
		};

		vm.setKey = function() {
			Sheet.setKey(Sheet.settings.key.name, Sheet.settings.key.symbol);
		};

		vm.setSheet = function(sheet) {
			try {
				angular.extend(Sheet, JSON.parse(sheet.json));
				Sheet.setKey(Sheet.settings.key.name, Sheet.settings.key.symbol);
				G.sheetId = sheet.name;
			} catch (e) {
				$ionicPopup.alert({
					template: e.message,
					title: e.name,
				});
			}
		};

		vm.getSheets();
	}
}());
