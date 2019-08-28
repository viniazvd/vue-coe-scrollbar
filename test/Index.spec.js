import { shallowMount } from '@vue/test-utils'

import VueCoeScrollbar from '../src/Index.vue'

/* eslint-disable */
describe('VueCoeScrollbar', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(VueCoeScrollbar)

    expect (wrapper.isVueInstance()).toBeTruthy()
  })
})
