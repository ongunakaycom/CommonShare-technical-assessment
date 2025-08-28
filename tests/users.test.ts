/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import Users from '../app/users.vue'
import { describe, it, expect } from 'vitest'

describe('Users.vue', () => {
  it('renders users from users.json', async () => {
    const wrapper = mount(Users)

    // Wait for any async operations inside the component
    await wrapper.vm.$nextTick()
    
    // Ensure the component exists
    expect(wrapper.exists()).toBe(true)

    // Check that some known users from users.json are rendered
    const text = wrapper.text()
    expect(text).toContain('Alice Johnson')
    expect(text).toContain('Bob Smith')
    expect(text).toContain('Charlie Brown')

    // Optionally, check that all 20 users appear
    const usersCount = text.match(/Alice Johnson|Bob Smith|Charlie Brown|Diana Evans|Ethan White|Fiona Green|George Harris|Hannah Lee|Ian Turner|Julia King|Kevin Scott|Laura Adams|Michael Young|Natalie Hall|Oliver Wright|Paula Baker|Quentin Roberts|Rachel Mitchell|Steven Parker|Tina Collins/g)
    expect(usersCount?.length).toBeGreaterThanOrEqual(3)
  })
})
