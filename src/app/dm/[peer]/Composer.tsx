'use client'

export default function Composer({ text, setText, onSend }: { text: string; setText: (v: string) => void; onSend: () => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSend() }} className="flex flex-col md:flex-row md:items-end gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 w-full px-3 py-2 border rounded-md" placeholder="Mesaj yazın" />
      <button disabled={!text.trim()} className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">Gönder</button>
    </form>
  )
}


