/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '../app/app.vue'

// All 20 users
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

describe('App.vue - login all users', () => {
  it('should allow all users to log in successfully', async () => {
    const wrapper = mount(App, {
      data() {
        return { users }
      }
    })

    for (const user of users) {
      // Fill login form
      await wrapper.setData({ email: user.email, password: user.password })
      await wrapper.find('form').trigger('submit.prevent')

      const vm = wrapper.vm as any  // <-- cast to any to access currentUser, route

      // Assert login success
      expect(vm.currentUser).toBeDefined()
      expect(vm.currentUser.email).toBe(user.email)
      expect(vm.route).toBe('/dashboard')

      // Logout before next iteration
      await wrapper.find('button.btn-outline-danger').trigger('click')
      expect(vm.currentUser).toBeNull()
      expect(vm.route).toBe('/')
    }
  })
})
