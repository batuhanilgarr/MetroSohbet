'use client'

import { useEffect, useMemo, useState } from 'react'

function extractFirstUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/i
  const m = text.match(urlRegex)
  return m ? m[0] : null
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    return null
  } catch {
    return null
  }
}

function isTwitterStatus(url: string): boolean {
  try {
    const u = new URL(url)
    return u.hostname.includes('twitter.com') || u.hostname.includes('x.com')
  } catch {
    return false
  }
}

export default function LinkEmbed({ content }: { content: string }) {
  const url = useMemo(() => extractFirstUrl(content), [content])
  const [expanded, setExpanded] = useState(false)
  if (!url) return null

  const ytId = getYouTubeId(url)
  const isTw = isTwitterStatus(url)

  return (
    <div className="mt-2 max-w-md">
      {!expanded ? (
        <button
          className="text-xs text-blue-600 hover:text-blue-800"
          onClick={() => setExpanded(true)}
        >
          Önizlemeyi göster
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-500">Bağlantı önizleme</span>
            <button
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setExpanded(false)}
            >
              Gizle
            </button>
          </div>
          {ytId ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          ) : isTw ? (
            <TwitterEmbed url={url} />
          ) : null}
        </div>
      )}
    </div>
  )
}

function TwitterEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as { twttr?: { widgets?: { load?: () => void } } }).twttr) {
      const s = document.createElement('script')
      s.src = 'https://platform.twitter.com/widgets.js'
      s.async = true
      s.charset = 'utf-8'
      document.body.appendChild(s)
    } else if (typeof window !== 'undefined' && (window as { twttr?: { widgets?: { load?: () => void } } }).twttr?.widgets?.load) {
      const twttr = (window as { twttr?: { widgets?: { load?: () => void } } }).twttr
      if (twttr?.widgets?.load) {
        twttr.widgets.load()
      }
    }
  }, [url])
  return (
    <blockquote className="twitter-tweet">
      <a href={url}></a>
    </blockquote>
  )
}


