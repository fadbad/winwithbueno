const methodMap = [
	[
		'requestFullscreen',
		'exitFullscreen',
		'fullscreenElement',
		'fullscreenEnabled',
		'fullscreenchange',
		'fullscreenerror',
	],
	// New WebKit
	[
		'webkitRequestFullscreen',
		'webkitExitFullscreen',
		'webkitFullscreenElement',
		'webkitFullscreenEnabled',
		'webkitfullscreenchange',
		'webkitfullscreenerror',

	],
	// Old WebKit
	[
		'webkitRequestFullScreen',
		'webkitCancelFullScreen',
		'webkitCurrentFullScreenElement',
		'webkitCancelFullScreen',
		'webkitfullscreenchange',
		'webkitfullscreenerror',

	],
	[
		'mozRequestFullScreen',
		'mozCancelFullScreen',
		'mozFullScreenElement',
		'mozFullScreenEnabled',
		'mozfullscreenchange',
		'mozfullscreenerror',
	],
	[
		'msRequestFullscreen',
		'msExitFullscreen',
		'msFullscreenElement',
		'msFullscreenEnabled',
		'MSFullscreenChange',
		'MSFullscreenError',
	],
];

const DOC:any = typeof document !== 'undefined' ? document : {}

const nativeAPI: any = (() => {
	const unprefixedMethods = methodMap[0];
	const returnValue = {};

	for (const methodList of methodMap) {
		const exitFullscreenMethod = methodList?.[1];
		if (exitFullscreenMethod in DOC) {
			for (const [index, method] of methodList.entries()) {
				returnValue[unprefixedMethods[index]] = method;
			}

			return returnValue;
		}
	}

	return false;
})();

const eventNameMap = {
	change: nativeAPI.fullscreenchange,
	error: nativeAPI.fullscreenerror,
};

// eslint-disable-next-line import/no-mutable-exports
let screenfull: any = {
	isEnabled: false,
	// eslint-disable-next-line default-param-last
	request(element = DOC.documentElement, options) {
		return new Promise((resolve, reject) => {
			const onFullScreenEntered = () => {
				screenfull.off('change', onFullScreenEntered);
				resolve('');
			};

			screenfull.on('change', onFullScreenEntered);

			const returnPromise = element[nativeAPI.requestFullscreen](options);

			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenEntered).catch(reject);
			}
		});
	},
	exit() {
		return new Promise((resolve, reject) => {
			if (!screenfull.isFullscreen) {
				resolve('');
				return;
			}

			const onFullScreenExit = () => {
				screenfull.off('change', onFullScreenExit);
				resolve('');
			};

			screenfull.on('change', onFullScreenExit);

			const returnPromise = DOC[nativeAPI.exitFullscreen]();

			if (returnPromise instanceof Promise) {
				returnPromise.then(onFullScreenExit).catch(reject);
			}
		});
	},
	toggle(element, options) {
		return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
	},
	onchange(callback) {
		screenfull.on('change', callback);
	},
	onerror(callback) {
		screenfull.on('error', callback);
	},
	on(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			DOC.addEventListener(eventName, callback, false);
		}
	},
	off(event, callback) {
		const eventName = eventNameMap[event];
		if (eventName) {
			DOC.removeEventListener(eventName, callback, false);
		}
	},
	raw: nativeAPI,
};

Object.defineProperties(screenfull, {
	isFullscreen: {
		get: () => Boolean(DOC[nativeAPI.fullscreenElement]),
	},
	element: {
		enumerable: true,
		get: () => DOC[nativeAPI.fullscreenElement] ?? undefined,
	},
	isEnabled: {
		enumerable: true,
		// Coerce to boolean in case of old WebKit.
		get: () => Boolean(DOC[nativeAPI.fullscreenEnabled]),
	},
});

if (!nativeAPI) {
	screenfull = {isEnabled: false};
}

export default screenfull;
