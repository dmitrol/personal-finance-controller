<template>
  <va-modal
    class="fc-modal"
    :mobile-fullscreen="false"
    :model-value="props.show"
    size="small"
  >
    <template #content="{ cancel }">
      <va-form
        class="fc-form"
        tag="form"
        ref="form"
        @keyup.enter="handleForm"
        @validation="validation = $event"
      >
        <div class="fc-form__title">
          {{ $t('currency.create_modal_title') }}
        </div>
        <va-input
          v-model="title"
          type="text"
          :label="t('currency.modal_title')"
          ref="input"
          :rules="validators.emptyValueValidator"
        />
        <va-input
          v-model="code"
          type="text"
          :label="t('currency.modal_code')"
          ref="input"
          :rules="validators.currencyCodeValidator"
        />
        <va-input
          v-model="rate"
          type="text"
          :label="t('currency.modal_rate', { main: mainCurrency?.code })"
          ref="input"
        />
        <div class="fc-checkbox-group">
          <va-checkbox
            v-model="main"
            :label="t('currency.modal_main')"
          ></va-checkbox>
        </div>

        <div class="fc-form__buttons">
          <va-button
            class="fc-mr-1"
            color="primary"
            :loading="buttonLoading"
            @click="handleForm"
          >
            {{ t('global.button_ok') }}
          </va-button>
          <va-button class="fc-ml-1" color="danger" @click="cancel">
            {{ t('global.button_cancel') }}
          </va-button>
        </div>
      </va-form>
    </template>
  </va-modal>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import notification from '@/service/notification'
import validators from '@/service/validators'

const store = useStore()
const { t } = useI18n({})
const emit = defineEmits(['ok'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const title = ref('')
const code = ref('')
const rate = ref(1)
const main = ref(false)
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

const mainCurrency = computed(() => {
  return store.state.profile.mainCurrency
})

function handleForm() {
  form.value.validate()
  const newCurrency = {
    title: title.value,
    code: code.value,
    rate: rate.value,
    main: main.value,
  }
  if (validation.value) {
    buttonLoading.value = true
    store
      .dispatch('currency/addCurrency', newCurrency)
      .then(() => {
        resetModal()
        emit('ok')
        notification.success(t('currency.create_success'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
function resetModal() {
  title.value = ''
  code.value = ''
  rate.value = 1
  main.value = false
}
</script>

<style lang="scss" scoped></style>
