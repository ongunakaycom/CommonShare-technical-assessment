/// <reference types="vitest" />
import { vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../app/app.vue'
import fs from 'fs'
import path from 'path'

// Read the JSON file from public/users.json
const usersFile = path.resolve(__dirname, '../public/users.json')
const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))

beforeEach(() => {
  // Mock fetch to return the users.json content
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: async () => users
  } as any)
})

describe('App.vue - login all users', () => {
  it('should allow all users to log in successfully', async () => {
    const wrapper = mount(App)

    const vm = wrapper.vm as any

    for (const user of users) {
      // Set refs directly (email and password are refs in <script setup>)
      vm.email = user.email
      vm.password = user.password
      await wrapper.find('form').trigger('submit.prevent')

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
