import { PlayIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { t } from '../../config/strings'
import type { Video } from '../../types/tmdb'

/**
 * Facade: shows the YouTube thumbnail and only loads the (heavy) player
 * iframe when the user asks for it. Uses youtube-nocookie.com so no tracking
 * cookies are set until playback.
 */
export function TrailerPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video max-w-[860px] overflow-hidden rounded-md bg-[#14110e]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
          title={video.name}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t.movie.playTrailer(video.name)}
          className="group absolute inset-0 size-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            decoding="async"
            className="size-full object-cover opacity-85"
          />
          <span className="absolute inset-0 m-auto grid size-[72px] play-button place-items-center rounded-full bg-surface text-ink shadow-soft">
            <PlayIcon aria-hidden="true" weight="fill" className="ml-0.5 size-7" />
          </span>
          <span className="absolute bottom-3 left-4 max-w-[80%] truncate text-left text-sm text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]">
            {video.name}
          </span>
        </button>
      )}
    </div>
  )
}
