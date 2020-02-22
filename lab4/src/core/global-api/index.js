import { ASSET_TYPES } from 'shared/constants'
import { initExtend } from './extend'

export function initGlobalAPI (Vue) {
  Vue.options = Object.create(null)
  Vue.options._base = Vue
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })
  initExtend(Vue)
}
