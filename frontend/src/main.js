import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import i18n from '@/i18n'
import { createVuesticEssential, VaButton } from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'
// import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/styles/typography.css'

let app = createApp(App)

app
  .use(store)
  .use(router)
  .use(i18n)
  .use(createVuesticEssential({ components: { VaButton } }))
  .mount('#app')
