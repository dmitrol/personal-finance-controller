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
        :rules="emailValidator"
      />
      <va-input
        v-model="password"
        type="password"
        :label="t('global.password')"
        :rules="passwordValidator"
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'

const store = useStore()
const router = useRouter()
const { init } = useToast()
const { t } = useI18n({})

const email = ref('')
const password = ref('')
const validation = ref(null)
const form = ref(null)

const emailValidator = computed(() => {
  return [
    (value) =>
      /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
        value
      ) || t('global.email_input_error'),
  ]
})
const passwordValidator = computed(() => {
  return [
    (value) =>
      value.length > 3 || t('global.password_min_length', { value: 4 }),
    (value) =>
      value.length < 30 || t('global.password_max_length', { value: 30 }),
  ]
})

function handleForm() {
  form.value.validate()
  if (validation.value) {
    store
      .dispatch('auth/registration', {
        email: email.value,
        password: password.value,
      })
      .then(() => {
        init({ message: t('registration_success'), color: 'success' })
        router.push({ name: 'login' })
      })
  }
}
</script>

<style lang="scss" scoped></style>
