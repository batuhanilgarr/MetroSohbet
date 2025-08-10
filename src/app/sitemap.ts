import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const { data } = await supabase.from('metro_lines').select('name')
  const lines = (data || []).map(({ name }) => ({ url: `${base}/chat/${name}`, lastModified: new Date() }))
  return [
    { url: base, lastModified: new Date() },
    ...lines,
  ]
}


