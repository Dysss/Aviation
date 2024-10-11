import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vitest/config';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		preview: {
			port: parseInt(env.VITE_PREVIEW_PORT)
		}
	};
});
