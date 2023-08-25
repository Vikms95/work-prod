import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.hdr'],
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 9000,
  },
  preview: {
    port: 9000,
  },
  build: {
    sourcemap: true,
    port: 9000,
  },
  preview: {
    port: 9000,
  },
})
