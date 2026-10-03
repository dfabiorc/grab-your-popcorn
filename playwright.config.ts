import { defineConfig, devices } from '@playwright/test'

const PORT = 4174
const isCI = Boolean(process.env.CI)

/**
 * End-to-end tests run against a production build served by `vite preview`
 * under the real base path, with TMDB mocked (see e2e/fixtures.ts), so no API
 * key is needed. The build goes to dist-e2e to never mix with a real build.
 *
 * Locally you can reuse an installed browser instead of downloading one:
 *   PLAYWRIGHT_CHANNEL=msedge npm run e2e
 */
const channel = process.env.PLAYWRIGHT_CHANNEL

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/grab-your-popcorn/`,
    trace: 'retain-on-failure',
    ...(channel ? { channel } : {}),
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: `npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/grab-your-popcorn/`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    // A placeholder key: every TMDB request is intercepted by the tests.
    env: { VITE_TMDB_API_KEY: 'e2e-placeholder' },
  },
})
