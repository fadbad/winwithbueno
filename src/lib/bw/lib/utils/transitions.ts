
export const typewriter = (node: HTMLElement, { speed = 1.2, easing }) => {
	const isSingleTextNode = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

	if (!isSingleTextNode) {
		throw new Error(`This transition only works on elements with a single text node child`);
	}

	const text = node.textContent;
	const duration = text.length / (speed * 0.01);

	return {
		easing,
		duration,
		tick: (t) => {
			const i = ~~(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
};

export function flipboard(node: HTMLElement, {delay = 0, duration = 400, easing}) {
	const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
	const text = node.textContent.trim();

	let lastTime = 0;

	return {
		delay,
        duration,
        easing,
		tick(t) {
			if (t === 1) {
				node.textContent = text;
				return;
			}

			const now = Date.now();
			if (now - lastTime < 32) return;
			lastTime = now;

			let str = '';
			for (let i = 0; i < text.length; i++) {
				const progress = i / text.length;
				if (text[i] === ' ' || progress < t * 0.9) {
					str += text[i];
				} else if (progress < t * 1.5) {
					str += randomChars[Math.floor(Math.random() * randomChars.length)];
				} else if (progress < t * 2) {
					str += '-';
				} else {
					str += ' ';
				}
			}
			node.textContent = str;
		}
	};
}
