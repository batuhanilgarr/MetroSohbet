'use client'

import { use, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
const Composer = dynamic(() => import('./Composer'))
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface DMPageProps { params: Promise<{ peer: string }> }
interface DMRow { id: string; thread_key: string; from_nick: string; to_nick: string; content: string; created_at: string }

export default function DMThreadPage({ params }: DMPageProps) {
  const { peer } = use(params)
  const [nickname, setNickname] = useState('')
  const [items, setItems] = useState<DMRow[]>([])
  const [text, setText] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  const threadKey = useMemo(() => (nickname ? getThreadKey(nickname, peer) : ''), [nickname, peer])

  useEffect(() => {
    const n = typeof window !== 'undefined' ? localStorage.getItem('nickname') || '' : ''
    setNickname(n)
  }, [])

  useEffect(() => {
    if (!nickname || !threadKey) return
    load()
    const ch = supabase
      .channel(`dms:${threadKey}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dms', filter: `thread_key=eq.${threadKey}` }, (p) => {
        const incoming = p.new as DMRow
        setItems((s) => {
          // ignore if already exists by id
          if (s.some((m) => m.id === incoming.id)) return s
          // drop optimistic temp matching same author+content
          const withoutTemps = s.filter((m) => !(m.id.startsWith('temp') && m.from_nick === incoming.from_nick && m.content === incoming.content))
          return [...withoutTemps, incoming]
        })
        scrollBottom()
      })
      .subscribe()
    return () => { ch.unsubscribe() }
  }, [nickname, threadKey])

  async function load() {
    const { data } = await supabase
      .from('dms')
      .select('*')
      .eq('thread_key', threadKey)
      .order('created_at', { ascending: true })
      .limit(200)
    setItems((data || []) as DMRow[])
    scrollBottom()
  }

  function scrollBottom() {
    requestAnimationFrame(() => {
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
    })
  }

  // Auto-scroll whenever list changes
  useEffect(() => {
    scrollBottom()
  }, [items])

  async function send() {
    const content = text.trim()
    if (!content || !nickname || !threadKey) return
    // optimistic append
    const temp: DMRow = {
      id: `temp-${Date.now()}`,
      thread_key: threadKey,
      from_nick: nickname,
      to_nick: peer,
      content,
      created_at: new Date().toISOString(),
    }
    setItems((s) => [...s, temp])
    setText('')
    scrollBottom()
    const { error } = await supabase.from('dms').insert({ thread_key: threadKey, from_nick: nickname, to_nick: peer, content })
    if (error) {
      // rollback on error
      setItems((s) => s.filter((m) => m.id !== temp.id))
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <Link href="/dm" className="text-gray-600 hover:text-gray-800">← Mesajlar</Link>
            <div className="font-semibold">{peer}</div>
            <div />
          </div>
          <div ref={boxRef} className="p-4 h-[60vh] overflow-y-auto space-y-3">
            {items.map((m) => {
              const mine = m.from_nick === nickname
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : ''}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-2xl ${mine ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                    <div className="text-xs opacity-70 mb-0.5">{new Date(m.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-4 border-t">
            <Composer text={text} setText={setText} onSend={send} />
          </div>
        </div>
      </div>
    </div>
  )
}

function getThreadKey(a: string, b: string): string {
  const [x, y] = [a, b].sort()
  return `${x}__${y}`
}


