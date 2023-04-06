<template>
  <div class="auth-page">
    <va-form
      class="fc-form"
      tag="form"
      ref="form"
      @validation="validation = $event"
    >
      <div class="fc-form__title">{{ $t('global.registration') }}</div>
      <va-input
        v-model="email"
        type="email"
        :label="t('global.email')"
        ref="input"
        :rules="validators.emailValidator"
      />
      <va-input
        v-model="password"
        type="password"
        :label="t('global.password')"
        :rules="validators.passwordValidator"
      />
      <va-select
        v-model="currencySelect"
        max-height="105px"
        :label="t('global.registration_currency')"
        :options="currencyOptions"
        :rules="validators.emptySelectValidator"
      />
      <div class="auth-submit">
        <va-button type="submit" @click.prevent="handleForm">
          {{ $t('global.button_submit') }}
        </va-button>
        <div>
          <router-link :to="{ name: 'login' }">
            {{ $t('global.login_link') }}
          </router-link>
        </div>
      </div>
    </va-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import validators from '@/service/validators'

const store = useStore()
const router = useRouter()
const { init } = useToast()
const { t } = useI18n({})

const email = ref('')
const password = ref('')
const currencySelect = ref({ text: t('global.dollar'), value: 'USD' })

const currencyOptions = ref([
  { text: t('global.dollar'), value: 'USD' },
  { text: t('global.euro'), value: 'EUR' },
])
const validation = ref(null)
const form = ref(null)

function handleForm() {
  form.value.validate()
  if (validation.value) {
    store
      .dispatch('auth/registration', {
        email: email.value,
        password: password.value,
        currecy_title: currencySelect.value.text,
        currecy_code: currencySelect.value.value,
      })
      .then(() => {
        init({ message: t('global.registration_success'), color: 'success' })
        router.push({ name: 'login' })
      })
  }
}
</script>

<style lang="scss" scoped></style>
