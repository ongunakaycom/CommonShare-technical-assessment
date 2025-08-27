import { describe, it, expect } from 'vitest'
import { useAuthStore } from '~/store/auth'

describe('Auth Store', () => {
  it('logs in valid user', () => {
    const store = useAuthStore()
    const result = store.login('admin@example.com','admin123')
    expect(result).toBe(true)
    expect(store.user?.email).toBe('admin@example.com')
  })
})
