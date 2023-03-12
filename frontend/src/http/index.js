'use strict'
import store from '@/store'
const axios = require('axios')
import router from '@/router'
import i18n from '@/i18n/index.js'
import { useToast } from 'vuestic-ui'
const { init } = useToast()

const apiURL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api'

const instance = axios.create({
  withCredentials: true,
  baseURL: apiURL,
})

instance.interceptors.request.use(function (config) {
  if (config.url.includes('storage')) {
    return config
  }
  if (store.state.auth.accessToken) {
    config.headers['Authorization'] = `Bearer ${store.state.auth.accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  function (response) {
    return {
      data: response.data,
      response,
    }
  },
  async function (error) {
    const originalRequest = error.config
    const response = error.response ? error.response : null
    const statusCode = response?.status || 0
    const errorMessage = response?.data?.message || ' '

    if (statusCode === 401) {
      if (originalRequest && originalRequest.url !== 'refresh') {
        await store.dispatch('auth/refreshToken')
        return instance.request(originalRequest)
      } else {
        router.push({ name: 'login' })
      }
    } else if (statusCode >= 500) {
      init({
        message: i18n.global.t('global.server_error_msg'),
        color: 'danger',
        duration: 6000,
      })
    } else if (statusCode === 0) {
      init({
        message: i18n.global.t('global.internet_error'),
        color: 'danger',
        duration: 8000,
      })
    } else if (statusCode === 400) {
      init({
        message: errorMessage,
        color: 'danger',
        duration: 6000,
      })
    } else if (statusCode === 403) {
      init({
        message: i18n.global.t('global.cannot_perform_action'),
        color: 'danger',
        duration: 4000,
      })
    } else if (statusCode === 422) {
      init({
        message: errorMessage,
        color: 'danger',
        duration: 6000,
      })
    } else if (statusCode === 404) {
      init({
        message: 'sdf',
        color: 'danger',
        duration: 6000,
      })
    }

    if (originalRequest && originalRequest.url === 'refresh') {
      router.push({ name: 'login' })
    }

    return Promise.reject(error)
  }
)

export default instance
