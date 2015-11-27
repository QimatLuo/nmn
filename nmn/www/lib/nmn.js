(function() {
	'use strict';

	angular
		.module(
			'nmn', []
		)
		.factory('nmn', nmn)

	;

	function nmn() {
		var audioCtx, output;

		audioCtx = new AudioContext();

		output = {
			play: function(array) {
				var sec = audioCtx.currentTime;
				var tempo;

				array
					.forEach(
						function(note) {
							if (note.n) {
								output.playNote(
									note,
									sec
								);
							}

							sec += tempo2second(note);
						}
					);
			},
			playNote: function(note, start) {
				var semitone;

				output.oscillator = audioCtx.createOscillator();

				semitone = number2semitone(note) + octave2semitone(note);
				output.oscillator.frequency.value = melScale(semitone);
				console.log(semitone, output.oscillator.frequency.value);
				output.oscillator.connect(audioCtx.destination);

				start = start || audioCtx.currentTime;
				output.oscillator.start(start);
				if (note.t) {
					output.oscillator.stop(start + tempo2second(note));
				}
			},
			settings: {
				frequency: 440,
			},
			stop: function() {
				if (
					output.oscillator &&
					output.oscillator.stop
				) {
					output.oscillator.stop();
				}
			},
		};

		return output;

		function melScale(semitone) {
			semitone += (-6 - 24 + 3);
			return output.settings.frequency * Math.pow(Math.pow(2, 1 / 12), semitone);
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

			sec = 1 / note.t;

			if (note.d) {
				sec = sec * 1.5;
			}

			return sec * 4;
		}
	}
}());
