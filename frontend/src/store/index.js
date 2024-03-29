import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import global from './modules/global'
import currency from './modules/currency'
import category from './modules/category'
import bill from './modules/bill'
import record from './modules/record'
import transfer from './modules/transfer'
import statistic from './modules/statistic'

export default createStore({
  modules: {
    auth,
    profile,
    global,
    currency,
    category,
    bill,
    record,
    transfer,
    statistic,
  },
})
