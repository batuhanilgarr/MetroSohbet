import { censorContent } from '@/lib/text-filters'

describe('censorContent', () => {
  it('censors single bad word', () => {
    expect(censorContent('bu bir amk testidir')).toBe('bu bir *** testidir')
  })

  it('censors case-insensitive and multiple', () => {
    expect(censorContent('Siktir git, salak!')).toBe('****** git, *****!')
  })

  it('leaves clean text untouched', () => {
    const s = 'Merhaba dünya'
    expect(censorContent(s)).toBe(s)
  })
})


