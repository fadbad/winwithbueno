/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		userid?: string;
		token?: string,
		user?: object,
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}

interface Window {
	dataLayer?: any
}

interface Navigator {
	getUserMedia: () => void;
	webkitGetUserMedia: () => void;
	mozGetUserMedia: () => void;
	msGetUserMedia: () => void;
}
