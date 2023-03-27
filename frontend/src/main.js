import '@/style/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'

import {
  createVuesticEssential,
  VaButton,
  VaToast,
  VaForm,
  VaInput,
  VaScrollContainer,
  VaModal,
  VaCheckbox,
  VaPagination,
  VaSidebar,
  VaSelect,
} from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/styles/typography.css'

let app = createApp(App)

app
  .use(store)
  .use(router)
  .use(
    createVuesticEssential({
      components: {
        VaButton,
        VaToast,
        VaForm,
        VaInput,
        VaScrollContainer,
        VaModal,
        VaCheckbox,
        VaPagination,
        VaSidebar,
        VaSelect,
      },
    })
  )
  .use(i18n)
  .mount('#app')

//
