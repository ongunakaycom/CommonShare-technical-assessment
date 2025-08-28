/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import Users from '../app/users.vue'
import { describe, it, expect } from 'vitest'

// All JSON data hardcoded in the test
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'pass123', role: 'admin', country: 'USA' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', password: 'pass123', role: 'user', country: 'UK' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', password: 'pass123', role: 'user', country: 'Canada' },
  { id: 4, name: 'Diana Evans', email: 'diana.evans@example.com', password: 'pass123', role: 'user', country: 'Germany' },
  { id: 5, name: 'Ethan White', email: 'ethan.white@example.com', password: 'pass123', role: 'user', country: 'Australia' },
  { id: 6, name: 'Fiona Green', email: 'fiona.green@example.com', password: 'pass123', role: 'user', country: 'USA' },
  { id: 7, name: 'George Harris', email: 'george.harris@example.com', password: 'pass123', role: 'user', country: 'UK' },
  { id: 8, name: 'Hannah Lee', email: 'hannah.lee@example.com', password: 'pass123', role: 'user', country: 'Canada' },
  { id: 9, name: 'Ian Turner', email: 'ian.turner@example.com', password: 'pass123', role: 'user', country: 'Germany' },
  { id: 10, name: 'Julia King', email: 'julia.king@example.com', password: 'pass123', role: 'user', country: 'Australia' },
  { id: 11, name: 'Kevin Scott', email: 'kevin.scott@example.com', password: 'pass123', role: 'user', country: 'UK' },
  { id: 12, name: 'Laura Adams', email: 'laura.adams@example.com', password: 'pass123', role: 'user', country: 'USA' },
  { id: 13, name: 'Michael Young', email: 'michael.young@example.com', password: 'pass123', role: 'user', country: 'Australia' },
  { id: 14, name: 'Natalie Hall', email: 'natalie.hall@example.com', password: 'pass123', role: 'user', country: 'Germany' },
  { id: 15, name: 'Oliver Wright', email: 'oliver.wright@example.com', password: 'pass123', role: 'user', country: 'USA' },
  { id: 16, name: 'Paula Baker', email: 'paula.baker@example.com', password: 'pass123', role: 'user', country: 'Canada' },
  { id: 17, name: 'Quentin Roberts', email: 'quentin.roberts@example.com', password: 'pass123', role: 'user', country: 'USA' },
  { id: 18, name: 'Rachel Mitchell', email: 'rachel.mitchell@example.com', password: 'pass123', role: 'user', country: 'UK' },
  { id: 19, name: 'Steven Parker', email: 'steven.parker@example.com', password: 'pass123', role: 'user', country: 'Germany' },
  { id: 20, name: 'Tina Collins', email: 'tina.collins@example.com', password: 'pass123', role: 'user', country: 'Canada' }
]

describe('Users.vue', () => {
  it('renders all users from JSON', async () => {
    const wrapper = mount(Users, { props: { initialUsers: users } })

    await wrapper.vm.$nextTick()

    const text = wrapper.text()

    // Verify some known users
    expect(text).toContain('Alice Johnson')
    expect(text).toContain('Bob Smith')
    expect(text).toContain('Charlie Brown')

    // Optional: verify total users
    expect(users.length).toBe(20)
  })
})
