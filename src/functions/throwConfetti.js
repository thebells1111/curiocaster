import confetti from 'canvas-confetti';

export default function throwConfetti() {
	var end = Date.now() + 0.1 * 1000;

	var colors = ['#fa6060', '#faa560', '#faf760', '#b2fa60', '#60c1fa', '#7260fa', '#fa60f2'];

	(function frame() {
		confetti({
			particleCount: 8,
			angle: 75,
			spread: 55,
			origin: { x: 0, y: 0.9 },
			colors: colors
		});
		confetti({
			particleCount: 8,
			angle: 105,
			spread: 55,
			origin: { x: 1, y: 0.9 },
			colors: colors
		});

		if (Date.now() < end) {
			requestAnimationFrame(frame);
		}
	})();
}
