import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import electronSimple from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electronSimple({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      }
    })
  ],
})
