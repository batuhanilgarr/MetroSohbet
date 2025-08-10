import { describe, it, expect } from '@jest/globals'

function computePresence(state: Record<string, Array<{ typing?: boolean }>>) {
  const uniqueUsers = Object.keys(state).filter((u) => u)
  const sessions = uniqueUsers.reduce((sum, u) => sum + ((state[u] && state[u].length) || 0), 0)
  const typing = uniqueUsers.filter((u) => (state[u] || []).some((m) => m.typing))
  return { users: uniqueUsers.length, sessions, typing }
}

describe('presence counting', () => {
  it('counts unique users and sessions', () => {
    const state = {
      ali: [{}, {}],
      veli: [{}],
    }
    const r = computePresence(state)
    expect(r.users).toBe(2)
    expect(r.sessions).toBe(3)
  })

  it('detects typing users', () => {
    const state = {
      a: [{ typing: true }],
      b: [{}],
    }
    const r = computePresence(state)
    expect(r.typing).toEqual(['a'])
  })
})


