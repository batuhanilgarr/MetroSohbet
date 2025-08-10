import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await res.text()
    const getMeta = (name: string) => {
      const m = html.match(new RegExp(`<meta[^>]+${name}=["']([^"']+)["']`, 'i'))
      return m ? m[1] : null
    }
    const data = {
      title: getMeta('property=\\"og:title\\"') || getMeta('name=\\"title\\"'),
      description: getMeta('property=\\"og:description\\"') || getMeta('name=\\"description\\"'),
      image: getMeta('property=\\"og:image\\"')
    }
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'preview failed' }, { status: 500 })
  }
}


