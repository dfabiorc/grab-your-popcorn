import { useQuery } from '@tanstack/react-query'
import { queries } from '../api/queries'
import { TMDB_IMAGE_BASE } from '../config/app'

/**
 * Image CDN base from /configuration, as TMDB recommends. Falls back to the
 * well-known URL so images never wait on (or break because of) this request.
 */
export function useImageBase(): string {
  const { data } = useQuery(queries.configuration())
  return data?.images.secure_base_url ?? TMDB_IMAGE_BASE
}
