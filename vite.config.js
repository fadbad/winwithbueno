import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
        include: ['lottie-web']
    },
	server: {
		port: 3000
	}
};

export default config;
