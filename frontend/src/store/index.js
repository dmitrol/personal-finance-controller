import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import global from './modules/global'
import currency from './modules/currency'

export default createStore({
  modules: {
    auth,
    profile,
    global,
    currency,
  },
})
