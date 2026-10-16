import path from 'path'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { defineConfig } from 'vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/** 全局变量名（对应package.json中的name） */
const name = 'tigersan-ui'

// https://vite.dev/config/
export default defineConfig({
  // base: './',
  plugins: [
    vue(),
    vueSetupExtend(),
    // vueDevTools(),
    // viteSingleFile(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver({}),
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ]
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/packages/index.ts'),
      name: name,
      fileName: name,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'echarts',
        'axios',
        'pinia',
        '@amap/amap-jsapi-loader',
        'dompurify',
        'json-bigint',
        'lottie-web',
        'nanoid'
      ],
      output: {
        exports: "named",
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          echarts: 'echarts',
          axios: 'axios',
          pinia: 'pinia',
          '@amap/amap-jsapi-loader': 'AMapLoader',
          dompurify: 'DOMPurify',
          'json-bigint': 'JSONbig',
          'lottie-web': 'lottie',
          nanoid: 'nanoid'
        },
      },
    },
  }
})
