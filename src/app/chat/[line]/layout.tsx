import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export default async function ChatLineLayout({ children, params }: { children: ReactNode; params: Promise<{ line: string }> }) {
  const { line } = await params
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  // Use REST to avoid extra client libs in server layout
  const url = `${supabaseUrl}/rest/v1/metro_lines?select=is_active&name=eq.${encodeURIComponent(line)}&limit=1`
  const res = await fetch(url, { headers: { apikey: anon, Authorization: `Bearer ${anon}` }, cache: 'no-store' })
  if (res.ok) {
    const rows = await res.json()
    const isActive = Array.isArray(rows) && rows[0]?.is_active !== false
    if (!isActive) {
      // Render passive notice form
      redirect(`/inactive?line=${encodeURIComponent(line)}`)
    }
  }

  return children
}

export async function generateMetadata({ params }: { params: Promise<{ line: string }> }): Promise<Metadata> {
  const { line } = await params
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const url = `${supabaseUrl}/rest/v1/metro_lines?select=display_name,color&name=eq.${encodeURIComponent(line)}&limit=1`
  let title = `MetroSohbet | ${line}`
  let description = `${line} hattı için gerçek zamanlı sohbet odası.`
  try {
    const res = await fetch(url, { headers: { apikey: anon, Authorization: `Bearer ${anon}` }, cache: 'no-store' })
    if (res.ok) {
      const rows = await res.json()
      if (Array.isArray(rows) && rows[0]?.display_name) {
        title = `MetroSohbet | ${rows[0].display_name}`
        description = `${rows[0].display_name} hattı için gerçek zamanlı sohbet.`
      }
    }
  } catch {}
  const canonical = `${base}/chat/${line}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { title, description }
  }
}


