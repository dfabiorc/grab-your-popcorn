import { FEATURED_TITLE } from './fixtures'
import { expect, expectNoA11yViolations, test, waitForImages } from './test'

const cards = (page: import('@playwright/test').Page) => page.locator('main ul li a[href^="#/movie/"]')

test.describe('home', () => {
  test('shows the latest release and a grid of new films', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'New releases' })).toBeVisible()
    // 20 per page, minus the featured film.
    await expect(cards(page)).toHaveCount(19)
    await expect(page).toHaveTitle(/Grab Your Popcorn/)
    await waitForImages(page)
    await expectNoA11yViolations(page)
  })

  test('loads more films when scrolling to the end', async ({ page }) => {
    await page.goto('./')
    await expect(cards(page)).toHaveCount(19)
    await page.getByRole('button', { name: 'Load more films' }).scrollIntoViewIfNeeded()
    await expect(cards(page)).toHaveCount(39)
    await page.getByRole('button', { name: 'Load more films' }).scrollIntoViewIfNeeded()
    await expect(cards(page)).toHaveCount(59)
    await expect(page.getByText('You have reached the end of the list.')).toBeVisible()
  })

  test('filters by genre and keeps the filter in a shareable URL', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Horror', exact: true }).click()
    await expect(page).toHaveURL(/#\/\?genre=27$/)
    await expect(page.getByRole('button', { name: 'Horror', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(cards(page)).toHaveCount(2)
    await expect(page.getByRole('link', { name: 'Night Garden' })).toBeVisible()
    // The featured film does not change with the filter.
    await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('button', { name: 'Horror', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(cards(page)).toHaveCount(2)
  })

  test('shows an empty state for a genre without releases', async ({ page }) => {
    await page.goto('./#/?genre=99')
    await expect(page.getByRole('heading', { name: 'No films here yet' })).toBeVisible()
    await page.getByRole('button', { name: 'Show all genres' }).click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(cards(page)).toHaveCount(19)
  })

  test('restores the scroll position when coming back from a film', async ({ page }) => {
    await page.goto('./')
    await expect(cards(page)).toHaveCount(19)
    await page.mouse.wheel(0, 1600)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000)
    // Wheel scrolling is smooth: wait until it settles before recording the position.
    const before = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let last = -1
          const check = () => (scrollY === last ? resolve(scrollY) : ((last = scrollY), setTimeout(check, 150)))
          check()
        }),
    )

    await page.evaluate(() => {
      const visible = [...document.querySelectorAll<HTMLAnchorElement>('main ul li a[href^="#/movie/"]')].find((a) => {
        const r = a.getBoundingClientRect()
        return r.top > 80 && r.bottom < innerHeight
      })
      visible?.click()
    })
    await expect(page).toHaveURL(/#\/movie\/\d+/)
    await page.getByRole('link', { name: 'Back', exact: true }).click()
    await expect(cards(page).first()).toBeVisible()
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(before)
  })

  test('switches theme and remembers it', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
    await expectNoA11yViolations(page)
  })
})
