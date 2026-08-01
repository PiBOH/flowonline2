import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const VERSION_FALLBACK = '0.0.0-UNKNOWN'

/**
 * Read `version.txt` synchronously at config-load time and expose the
 * trim'd string to the React bundle as `import.meta.env.VITE_APP_VERSION`.
 *
 * This is the SINGLE source-of-truth for the build-version string shown
 * in `.fprg` filenames and inside the About dialog — both must stay in
 * sync with the file on disk. If the file is missing or unreadable we
 * fall back to `0.0.0-UNKNOWN` so the UI is never lied to about which
 * version is running.
 */
function readBuildVersion(): string {
  try {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'version.txt'),
      'utf-8',
    )
    const trimmed = raw.trim()
    return trimmed.length > 0 ? trimmed : VERSION_FALLBACK
  } catch {
    return VERSION_FALLBACK
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // important for static hostings like GitHub Pages
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(readBuildVersion()),
  },
})
