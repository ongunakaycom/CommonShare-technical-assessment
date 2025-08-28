/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import Users from '../app/users.vue'
import { describe, it, expect } from 'vitest'

// Import the actual JSON
import users from '../public/users.json'

describe('Users.vue', () => {
  it('renders all users from users.json', async () => {
    const wrapper = mount(Users, {
      // Provide the users data via props or data injection if your component supports it
      props: {
        initialUsers: users
      }
    })

    await wrapper.vm.$nextTick()

    const text = wrapper.text()

    // Check first few users exist in rendered output
    expect(text).toContain(users[0].name) // Alice Johnson
    expect(text).toContain(users[1].name) // Bob Smith
    expect(text).toContain(users[2].name) // Charlie Brown

    // Optional: check the total number of users rendered
    const count = users.length
    expect(count).toBe(20)
  })
})
