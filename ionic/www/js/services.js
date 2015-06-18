(function() {
	'use strict';

	angular
		.module(
			'services', []
		)
		.factory('Sheet', Sheet)

	;

	function Sheet($q, $timeout) {
		var audioCtx, that;

		audioCtx = new AudioContext();

		that = {
			isPlaying: false,
			melScale: function(semitone) {
				semitone += that.key;
				return that.settings.frequency * Math.pow(Math.pow(2, 1 / 12), semitone);
			},
			num2semitone: function(num) {
				var semitone;

				semitone = (num - 1) * 2;

				if (num > 3) {
					semitone--;
				}

				return semitone;
			},
			play: function() {
				if (!that.raw.length) {
					return;
				}
				that.isPlaying = true;

				that.playNote();
			},
			playIndex: 0,
			playNote: function() {
				var note = that.raw[that.playIndex];

				if (!note || !that.isPlaying) {
					that.playIndex = 0;
					return that.stop();
				}

				var num = note.num;

				var semitone = that.num2semitone(num);

				var accidentals = note.accidentals;
				if (accidentals) {
					if (that.symbols[num] === undefined) {
						that.symbols[num] = 0;
					}
					accidentals.split('').forEach(
						function(accidental) {
							switch (accidental) {
								case '#':
									that.symbols[num]++;
									break;
								case 'b':
									that.symbols[num]--;
									break;
								case 'N':
									if (that.symbols[num] > 0) {
										that.symbols[num]--;
									} else if (that.symbols[num] < 0) {
										that.symbols[num]++;
									}
									break;
							}
						}
					);
				}
				semitone += that.symbols[num] || 0;

				var octaves = note.octaves;
				if (octaves) {
					octaves.split('').forEach(
						function(octave) {
							switch (octave) {
								case '+':
									semitone += 12;
									break;
								case '-':
									semitone -= 12;
									break;
							}
						}
					);
				}

				var tempo = note.tempo;
				tempo = 240 / that.settings.bpm / tempo;

				if (num > 0) {
					that.oscillator = audioCtx.createOscillator();
					that.oscillator.frequency.value = that.melScale(semitone);

					that.oscillator.connect(audioCtx.destination);

					that.oscillator.start(audioCtx.currentTime);
					that.oscillator.stop(audioCtx.currentTime + tempo);
				}

				that.playTimeout = $timeout(
					function() {
						that.playIndex++;
						that.playNote();
					},
					tempo * 1000
				);
			},
			playTimeout: false,
			raw: [],
			setBeat: function(numerator, denominator) {
				that.Settings.beat.numerator = numerator;
				that.Settings.beat.denominator = denominator;

				that.beatTs = 240 / that.settings.bpm / numerator * denominator;

				return that;
			},
			setKey: function(name, symbol) {
				var num, semitone;

				that.settings.key.name = name;
				that.settings.key.symbol = symbol;

				num = 'cdefgab'.search(name.toLowerCase()) + 1;
				semitone = that.num2semitone(num);

				switch (symbol) {
					case '#':
						semitone++;
						break;
					case 'b':
						semitone--;
						break;
				}

				that.key = semitone;
			},
			settings: {},
			stop: function() {
				that.symbols = {};
				that.oscillator.stop();
				that.isPlaying = false;
				$timeout.cancel(that.playTimeout);
			},
			symbols: {},
		};

		return that;
	}
}());
