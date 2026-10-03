import { describe, expect, it } from 'vitest'
import { imageSrcSet, imageUrl } from './images'

const BASE = 'https://image.tmdb.org/t/p/'

describe('imageUrl', () => {
  it('uses the smallest CDN size that covers the requested width', () => {
    expect(imageUrl('/abc.jpg', 342)).toBe(`${BASE}w342/abc.jpg`)
    expect(imageUrl('/abc.jpg', 300)).toBe(`${BASE}w342/abc.jpg`)
    expect(imageUrl('/b.jpg', 1280, BASE, 'backdrop')).toBe(`${BASE}w1280/b.jpg`)
  })

  it('maps large profile photos to the height-based h632 size', () => {
    expect(imageUrl('/p.jpg', 185, BASE, 'profile')).toBe(`${BASE}w185/p.jpg`)
    expect(imageUrl('/p.jpg', 400, BASE, 'profile')).toBe(`${BASE}h632/p.jpg`)
  })

  it('returns null when TMDB has no image', () => {
    expect(imageUrl(null, 342)).toBeNull()
  })
})

describe('imageSrcSet', () => {
  it('lists every size for the kind with width descriptors', () => {
    expect(imageSrcSet('/p.jpg', 'profile')).toBe(
      `${BASE}w45/p.jpg 45w, ${BASE}w185/p.jpg 185w, ${BASE}h632/p.jpg 421w`,
    )
  })

  it('respects a max width', () => {
    expect(imageSrcSet('/b.jpg', 'backdrop', BASE, 780)).toBe(`${BASE}w300/b.jpg 300w, ${BASE}w780/b.jpg 780w`)
  })

  it('is undefined without a path', () => {
    expect(imageSrcSet(undefined, 'poster')).toBeUndefined()
  })
})
