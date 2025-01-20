import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei']
  },
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'],
  server: {
    port: 3000
  }
}) 
