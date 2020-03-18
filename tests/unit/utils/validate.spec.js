import { isExternal } from '@/utils/multiple.js'

describe('Utils:validate', () => {
  it('isExternal', () => {
    expect(isExternal('/home')).toBe(false)
    expect(isExternal('./home')).toBe(false)
  })
})
