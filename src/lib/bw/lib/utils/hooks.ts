import { tick } from 'svelte';

export function clickoutside( node: HTMLElement, params ) {
	
	const { enabled: initialEnabled, callback } = params;

	const handleOutsideClick = ({ target }: MouseEvent) => {
		if (!node.contains(target as Node)) callback(node); // typescript hack, not sure how to solve without asserting as Node
	};

	function update({ enabled }: { enabled: boolean }) {
		if (enabled) {
			window.addEventListener('click', handleOutsideClick);
		} else {
			window.removeEventListener('click', handleOutsideClick);
		}
	}
	update({ enabled: initialEnabled });
	return {
		update,
		destroy() {
			window.removeEventListener('click', handleOutsideClick);
		}
	};
}

export function clipboard(node: HTMLElement, text: string) {
	const click = async () => {
		if (text)
			try {
				await navigator.clipboard.writeText(text);

				node.dispatchEvent(new CustomEvent('useclipboard', { detail: text }));
			} catch (e) {
				node.dispatchEvent(new CustomEvent('useclipboard-error', { detail: e }));
			}
	};

	node.addEventListener('click', click, true);

	return {
		update: (t: string) => (text = t),
		destroy: () => node.removeEventListener('click', click, true)
	};
}

export function cssvariable(
	node: HTMLElement,
	props
) {
	Object.entries(props).forEach(([key, value]) => {
		node.style.setProperty(`--${key}`, `${value}`);
	});

	return {
		update(_props) {
			Object.entries(_props).forEach(([key, value]) => {
				node.style.setProperty(`--${key}`, `${value}`);
				delete props[key];
			});

			Object.keys(props).forEach((name) => node.style.removeProperty(`--${name}`));
		}
	};
}

export function focus(node) {
	node.focus();

	return;
}

export function pageleave(node: HTMLElement, callback) {
	document.documentElement.addEventListener('mouseleave', callback);

	return {
		destroy() {
			document.documentElement.removeEventListener('mouseleave', callback);
		}
	};
}

export function tableave(node: HTMLElement, callback) {
	document.addEventListener('visibilitychange', callback);

	return {
		destroy() {
			document.removeEventListener('visibilitychange', callback);
		}
	};
}

export function download(
	node: HTMLElement,
	params: { blob: Blob; filename: string }
) {
	const click = async () => {
		const { blob, filename } = params;
		try {
			const anchor: HTMLAnchorElement = document.createElement('a');
			const url: string = URL.createObjectURL(blob);
			anchor.href = url;
			anchor.download = filename || '';
			document.body.appendChild(anchor);

			anchor.click();
			await tick();

			document.body.removeChild(anchor);
			URL.revokeObjectURL(url);
			node.dispatchEvent(
				new CustomEvent('usedownload', { detail: { blob: blob, filename: filename } })
			);
		} catch (e) {
			node.dispatchEvent(
				new CustomEvent('usedownload-error', { detail: { blob: blob, filename: filename } })
			);
		}
	};

	node.addEventListener('click', click, true);

	return {
		update: (_params: { blob: Blob; filename: string }) => (params = _params),
		destroy: () => node.removeEventListener('click', click, true)
	};
}
