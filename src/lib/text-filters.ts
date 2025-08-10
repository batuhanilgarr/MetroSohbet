export const PROHIBITED_CONTENT: string[] = [
  'amk', 'aq', 'amq', 'siktir', 'sik', 'orospu', 'piç', 'yarrak', 'bok', 'salak', 'aptal', 'gerizekalı',
  'mal', 'oç', 'oç.', 'puşt', 'kahpe', 'ananı', 'anan', 'ibne', 'ibn*', 'got', 'göt', 'yarak'
]

export function censorContent(input: string): string {
  const lower = input.toLowerCase()
  let censored = input
  for (const bad of PROHIBITED_CONTENT) {
    if (!bad) continue
    const safe = bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(safe, 'gi')
    if (re.test(lower)) {
      censored = censored.replace(re, (m) => '*'.repeat(m.length))
    }
  }
  return censored
}


