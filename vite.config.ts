import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import type { ProxyOptions } from 'vite'

export default defineConfig(({ mode }) => {

	const env = loadEnv(mode, process.cwd())
	const {
		VITE_BASE_API_PREFIX,
		VITE_BASE_API_URL
	} = env
	console.log('Loaded ENV:', env);
	const proxy: Record<string, string | ProxyOptions> = {
			[VITE_BASE_API_PREFIX]: {
				target: VITE_BASE_API_URL,
				changeOrigin: true,
				rewrite: (path: string) => path.replace(VITE_BASE_API_PREFIX, '')
			}
		}
		return {
			base: '/',
			plugins: [
				vue(),
				VueSetupExtend(),
				AutoImport({
					resolvers: [ElementPlusResolver()]
				}),
				Components({
					resolvers: [ElementPlusResolver()]
				})
			],
			optimizeDeps: {
				include: ['schart.js']
			},
			resolve: {
				alias: {
					'@': '/src',
					'~': '/src/assets'
				}
			},
			server:{proxy},
			preview: {proxy},
			define: {
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
			},
		}
	})


