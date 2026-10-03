import { FEATURED_TITLE, MISSING_ID, PERSON_NAME } from './fixtures'
import { expect, expectNoA11yViolations, test, waitForImages } from './test'

test.describe('film page', () => {
  test('opens from the home grid with its own shareable URL', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('link', { name: 'View film' }).click()
    await expect(page).toHaveURL(/#\/movie\/1000$/)
    await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()
    await expect(page).toHaveTitle(`${FEATURED_TITLE} (2026) · Grab Your Popcorn`)
  })

  test('shows every section and survives a reload', async ({ page }) => {
    await page.goto('./#/movie/1000')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()
    await expect(page.getByText('Every frame a letter.')).toBeVisible()
    for (const label of ['Released', 'Runtime', 'Genres', 'TMDB score']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
    await expect(page.getByText('1h 59m')).toBeVisible()
    // Director and writer merged per person; the gaffer is left out.
    await expect(page.getByText('Director, Screenplay')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Iris Vane' })).toBeVisible()
    await expect(page.getByText('Tom Ash')).toHaveCount(0)
    for (const section of ['Trailer', 'Cast', 'Reviews', 'More like this']) {
      await expect(page.getByRole('heading', { level: 2, name: section })).toBeVisible()
    }
    await waitForImages(page)
    await expectNoA11yViolations(page)
  })

  test('loads the trailer only when asked', async ({ page }) => {
    await page.goto('./#/movie/1000')
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.getByRole('button', { name: 'Play Official Trailer' }).click()
    await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/abc123xyz00/)
  })

  test('expands the cast and a long review', async ({ page }) => {
    await page.goto('./#/movie/1000')
    const cast = page.locator('#cast-list li')
    await expect(cast).toHaveCount(12)
    await page.getByRole('button', { name: 'Show all 14' }).click()
    await expect(cast).toHaveCount(14)

    const readMore = page.getByRole('button', { name: 'Read more' })
    await expect(readMore).toHaveAttribute('aria-expanded', 'false')
    await readMore.click()
    await expect(page.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true')
    // Markdown emphasis is rendered as plain text.
    await expect(page.getByText('A patient film.')).toBeVisible()
  })

  test('navigates to an actor and back', async ({ page }) => {
    await page.goto('./#/movie/1000')
    await page.getByRole('link', { name: new RegExp(`^${PERSON_NAME}`) }).click()
    await expect(page).toHaveURL(/#\/person\/2001$/)
    await expect(page.getByRole('heading', { level: 1, name: PERSON_NAME })).toBeVisible()
    await page.goBack()
    await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()
  })

  test('opens a recommended film at the top of the page', async ({ page }) => {
    await page.goto('./#/movie/1000')
    const recommendation = page.locator('section', { has: page.getByRole('heading', { name: 'More like this' }) })
    await recommendation.getByRole('link').first().click()
    await expect(page).toHaveURL(/#\/movie\/1010$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Paper Moon 1010' })).toBeVisible()
    expect(await page.evaluate(() => scrollY)).toBe(0)
  })

  test('shows a not-found state for unknown or invalid ids', async ({ page }) => {
    await page.goto(`./#/movie/${MISSING_ID}`)
    await expect(page.getByRole('heading', { name: 'Film not found' })).toBeVisible()
    await page.goto('./#/movie/not-a-number')
    await expect(page.getByRole('heading', { name: 'Film not found' })).toBeVisible()
  })
})
