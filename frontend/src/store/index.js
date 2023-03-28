import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import global from './modules/global'
import currency from './modules/currency'
import category from './modules/category'
import bill from './modules/bill'

export default createStore({
  modules: {
    auth,
    profile,
    global,
    currency,
    category,
    bill,
  },
})
