/// <reference types="vitest" />
import { mount } from '@vue/test-utils'
import App from '../app/app.vue'
import { describe, expect, it } from 'vitest'

describe('App.vue', () => {
  it('renders the app component', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})
