import { FEATURED_TITLE, MISSING_ID, PERSON_NAME } from './fixtures'
import { expect, expectNoA11yViolations, test, waitForImages } from './test'

test.describe('person page', () => {
  test('shows facts, biography, known for and filmography', async ({ page }) => {
    await page.goto('./#/person/2001')
    await expect(page.getByRole('heading', { level: 1, name: PERSON_NAME })).toBeVisible()
    await expect(page).toHaveTitle(`${PERSON_NAME} · Grab Your Popcorn`)
    await expect(page.getByText('Nowhere, Test County')).toBeVisible()
    await expect(page.getByText('She has never existed.')).toBeVisible()

    // "Known for": most-voted first (votes grow with the id in the fixtures),
    // without the self appearance (film 1005).
    const knownFor = page.locator('section', { has: page.getByRole('heading', { name: 'Known for', level: 2 }) })
    await expect(knownFor.getByRole('heading', { level: 3 })).toHaveText([
      'Paper Moon 1030',
      'Paper Moon 1020',
      FEATURED_TITLE,
    ])

    // Filmography: undated (TBA) first, then newest first; department filter.
    const rows = page.locator('#filmography-list li')
    await expect(rows.first()).toContainText('TBA')
    await expect(rows.first()).toContainText('Paper Moon 1030')
    await page.getByRole('button', { name: /^Directing/ }).click()
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText('Director')

    await waitForImages(page)
    await expectNoA11yViolations(page)
  })

  test('shows a not-found state', async ({ page }) => {
    await page.goto(`./#/person/${MISSING_ID}`)
    await expect(page.getByRole('heading', { name: 'Person not found' })).toBeVisible()
  })
})

test.describe('search', () => {
  test('searches from the header and lists people and films, without TV', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('searchbox', { name: 'Search movies and people' }).fill('ada')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/search\?q=ada$/)

    await expect(page.getByRole('heading', { level: 2, name: 'People' })).toBeVisible()
    await expect(page.getByRole('link', { name: new RegExp(`^${PERSON_NAME}`) })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ada and the Lighthouse' })).toBeVisible()
    await expect(page.getByText('A TV show that must not appear')).toHaveCount(0)
    await expect(page.getByRole('status')).toHaveText('Showing 1 film and 1 person')
    // Only one search field on the search page.
    await expect(page.getByRole('searchbox')).toHaveCount(1)
    await waitForImages(page)
    await expectNoA11yViolations(page)
  })

  test('updates the URL while typing without adding history entries', async ({ page }) => {
    await page.goto('./#/search')
    const input = page.getByRole('searchbox', { name: 'Search' })
    await expect(input).toBeFocused()
    const historyLength = await page.evaluate(() => history.length)

    await input.pressSequentially('ada m', { delay: 30 })
    await expect(page).toHaveURL(/#\/search\?q=ada\+m$/)
    await expect(page.getByRole('link', { name: new RegExp(`^${PERSON_NAME}`) })).toBeVisible()
    expect(await page.evaluate(() => history.length)).toBe(historyLength)

    await page.reload()
    await expect(input).toHaveValue('ada m')
  })

  test('shows prompt and no-results states', async ({ page }) => {
    await page.goto('./#/search')
    await expect(page.getByRole('heading', { name: 'Find a film or a person' })).toBeVisible()
    await page.getByRole('searchbox', { name: 'Search' }).fill('qqqzzz')
    await expect(page.getByRole('heading', { name: 'Nothing found' })).toBeVisible()
  })

  test('opens a person from the results', async ({ page }) => {
    await page.goto('./#/search?q=ada')
    await page.getByRole('link', { name: new RegExp(`^${PERSON_NAME}`) }).click()
    await expect(page).toHaveURL(/#\/person\/2001$/)
  })
})

test('unknown routes show a 404 page', async ({ page }) => {
  await page.goto('./#/this/does/not/exist')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to home' }).click()
  await expect(page.getByRole('heading', { level: 1, name: FEATURED_TITLE })).toBeVisible()
})
