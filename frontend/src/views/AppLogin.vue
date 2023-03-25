<template>
  <div class="auth-page">
    <va-form
      class="fc-form"
      tag="form"
      ref="form"
      @validation="validation = $event"
    >
      <div class="fc-form__title">{{ $t('global.login') }}</div>
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
      <div class="auth-submit">
        <va-button type="submit" @click.prevent="handleForm">
          {{ $t('global.button_submit') }}
        </va-button>
        <div>
          <router-link :to="{ name: 'registration' }">
            {{ $t('global.registration_link') }}
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
import { useI18n } from 'vue-i18n'
import validators from '@/service/validators'

const store = useStore()
const router = useRouter()
const { t } = useI18n({})

const email = ref('')
const password = ref('')
const validation = ref(null)
const form = ref(null)

function handleForm() {
  form.value.validate()
  if (validation.value) {
    store
      .dispatch('auth/login', {
        email: email.value,
        password: password.value,
      })
      .then(() => {
        router.push({ name: 'main' })
      })
  }
}
</script>

<style lang="scss" scoped></style>
