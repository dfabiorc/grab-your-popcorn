import { describe, expect, it } from 'vitest'
import { imageSrcSet, imageUrl } from './images'

const BASE = 'https://image.tmdb.org/t/p/'

describe('imageUrl', () => {
  it('builds a sized CDN url', () => {
    expect(imageUrl('/abc.jpg', 342)).toBe(`${BASE}w342/abc.jpg`)
  })

  it('returns null when TMDB has no image', () => {
    expect(imageUrl(null, 342)).toBeNull()
  })
})

describe('imageSrcSet', () => {
  it('lists every width for the kind', () => {
    expect(imageSrcSet('/p.jpg', 'profile')).toBe(`${BASE}w45/p.jpg 45w, ${BASE}w185/p.jpg 185w`)
  })

  it('respects a max width', () => {
    expect(imageSrcSet('/b.jpg', 'backdrop', BASE, 780)).toBe(`${BASE}w300/b.jpg 300w, ${BASE}w780/b.jpg 780w`)
  })

  it('is undefined without a path', () => {
    expect(imageSrcSet(undefined, 'poster')).toBeUndefined()
  })
})
