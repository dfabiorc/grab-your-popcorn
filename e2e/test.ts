import AxeBuilder from '@axe-core/playwright'
import { test as base, expect, type Page } from '@playwright/test'
import { mockTmdb } from './fixtures'

/**
 * `page` with TMDB mocked, and a guard that fails the test on any console
 * error or uncaught exception.
 */
export const test = base.extend<{ page: Page }>({
  page: async ({ page }, provide) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      // The intentional 404 fixtures are logged by the browser itself.
      if (message.type() === 'error' && !message.text().includes('404')) errors.push(message.text())
    })
    await mockTmdb(page)
    await provide(page)
    expect(errors, 'console errors').toEqual([])
  },
})

export { expect }

/** WCAG 2.2 A/AA violations on the current page (excluding third-party frames). */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).exclude('iframe').analyze()
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)
  expect(summary, 'accessibility violations').toEqual([])
}

/** Waits until every image in the viewport has finished its fade-in. */
export async function waitForImages(page: Page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLImageElement>('main img[data-loaded]')]
      .filter((img) => img.getBoundingClientRect().top < innerHeight)
      .every((img) => img.dataset.loaded === 'true'),
  )
}
