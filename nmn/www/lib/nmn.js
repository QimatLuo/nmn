(function() {
	'use strict';

	angular
		.module(
			'nmn', []
		)
		.directive('nmnNote', nmnNote)
		.directive('nmnTab', nmnTab)
		.factory('nmn', nmn)

	;

	function nmnNote() {
		return {
			controller: controller,
			controllerAs: 'vm',
			restrict: 'E',
			scope: {
				note: '=',
			},
			templateUrl: 'lib/nmn-note.html',
		};

		function controller(
			$scope
		) {
			var vm;

			vm = this;
			vm.note = $scope.note;
			vm.dash = [];
			vm.hr = [];
			vm.octave = Array.apply(null, Array(Math.abs($scope.note.o)));
			vm.dotted = Array.apply(null, Array($scope.note.d));

			vm.tempo = $scope.note.t;
			vm.number = $scope.note.n;

			if (vm.tempo < 4) {
				vm.dash = Array.apply(null, Array(4 / vm.tempo - 1));
			}
			while (vm.tempo > 4) {
				vm.hr.push(null);
				vm.tempo /= 2;
			}
		}
	}

	function nmnTab() {
		return {
			controller: controller,
			controllerAs: 'vm',
			restrict: 'E',
			scope: {
				tab: '=',
			},
			templateUrl: 'lib/nmn-tab.html',
		};

		function controller(
			nmn,
			$scope
		) {
			var vm;

			vm = this;
			vm.nmn = nmn;

			vm.select = function(note) {
				nmn.index = note.index;
			};

			$scope.$watch(
				'tab',
				function() {
					var key, sum;

					key = 4 / 4;
					sum = 1;

					vm.tempo = 0;
					vm.bars = [];

					angular.copy($scope.tab)
						.forEach(
							function(note, i, array) {
								note.index = i;

								if (i > 0) {
									sum = vm.bars[vm.bars.length - 1]
										.reduce(
											function(sum, note) {
												return sum + 1 / note.t + 1 / note.t * nmn.progression(note.d);
											},
											0
										);
								}
								mod = sum - key;

								if (mod > 0) {
									var copy, last, mod;

									last = array[i - 1];
									last.extend = true;
									copy = angular.copy(last);

									mod2tempo(copy, mod);
									mod2tempo(last, (1 / last.t + 1 / last.t * nmn.progression(last.d) - mod));

									vm.bars.push([copy]);
								} else if (mod === 0) {
									vm.bars.push([]);
								}

								vm.bars[vm.bars.length - 1].push(note);
								vm.tempo += 1 / note.t;

								if (note.d) {
									vm.tempo += 1 / note.t * nmn.progression(note.d);
								}

								if (note.signature) {
									key = eval(note.signature);
								}
							}
						);

					key = null;
					sum = null;
				},
				true
			);
		}

		function mod2tempo(note, mod) {
			var lv, steps;

			lv = 1;
			steps = [];

			while (mod !== 0) {
				if (mod >= lv) {
					mod -= lv;
					steps.push(lv);
				}
				lv /= 2;
			}

			note.t = 1 / steps[0];
			note.d = steps.length - 1;

			return note;
		}
	}

	function nmn() {
		var audioCtx, output;

		audioCtx = new AudioContext();

		output = {
			index: 0,
			onended: function() {},
			oscillators: [],
			play: function(array) {
				var sec;

				output.playIndex = output.index;
				sec = audioCtx.currentTime;

				array.slice(output.index)
					.forEach(
						function(note) {
							output.playNote(
								note,
								sec
							);

							sec += tempo2second(note);
						}
					);
			},
			playIndex: 0,
			playNote: function(note, start) {
				var oscillator, semitone;

				oscillator = audioCtx.createOscillator();

				semitone = number2semitone(note) + octave2semitone(note);
				oscillator.frequency.value = melScale(semitone);
				oscillator.connect(audioCtx.destination);

				start = start || audioCtx.currentTime;
				oscillator.start(start);
				if (note.t) {
					oscillator.stop(start + tempo2second(note));
				}

				oscillator.index = output.oscillators.length;
				oscillator.onended = function() {
					output.playIndex = output.index + this.index + 1;
					if (this.index + 1 === output.oscillators.length) {
						output.stop();
					}
					output.onended();
				};

				output.oscillators.push(oscillator);
			},

			progression: function(n) {
				var sum;

				sum = 0;

				while (n) {
					sum += Math.pow(2, -n);
					n--;
				}

				return sum;
			},
			settings: {
				bpm: 60,
				frequency: 440,
				pitch: 0,
			},
			stop: function() {
				output.oscillators.slice(output.playIndex)
					.forEach(
						function(o) {
							o.stop();
						}
					);

				output.oscillators = [];
			},
		};

		return output;

		function melScale(semitone) {
			if (semitone < 0) return 0;

			semitone += output.settings.pitch;
			return output.settings.frequency * Math.pow(Math.pow(2, 1 / 12), semitone + 3);
		}

		function number2semitone(note) {
			var num, semitone;

			num = note.n;

			if (num > 7) {
				num %= 7;
				num = num || 7;
			}

			semitone = (num - 1) * 2;
			num = null;

			if (semitone > 4) {
				semitone--;
			}

			return semitone;
		}

		function octave2semitone(note) {
			return note.o * 12 || 0;
		}

		function tempo2second(note) {
			var sec;

			sec = 60 / output.settings.bpm * 4 / note.t;

			if (note.d) {
				sec = sec * (1 + output.progression(note.d));
			}

			return sec;
		}
	}
}());
