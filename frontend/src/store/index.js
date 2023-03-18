import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import global from './modules/global'

export default createStore({
  modules: {
    auth,
    profile,
    global,
  },
})
