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
          {{ $t('currency.edit_form_title') }}
        </div>
        <va-input
          v-model="title"
          type="text"
          :label="t('currency.modal_title')"
          ref="input"
          :rules="validators.emptyValueValidator"
        />
        <va-input
          v-model="rate"
          type="text"
          :label="t('currency.modal_rate', { main: mainCurrency.code })"
          ref="input"
        />
        <div class="fc-checkbox-group">
          <va-checkbox
            v-model="main"
            :label="t('currency.modal_main')"
          ></va-checkbox>
        </div>

        <div class="confirm-buttons">
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
import {
  ref,
  computed,
  onMounted,
  onUpdated,
  defineProps,
  defineEmits,
} from 'vue'
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
  currency: {
    type: Object,
    required: true,
  },
})

const title = ref('')
const code = ref('')
const rate = ref(1)
const main = ref(false)
const form = ref(null)
const validation = ref(null)
const buttonLoading = ref(false)

const mainCurrency = computed(() => {
  return store.state.profile.mainCurrency
})

onMounted(() => {
  title.value = props.currency.title
  code.value = props.currency.code
  rate.value = props.currency.rate
  main.value = props.currency.main
})

onUpdated(() => {
  title.value = props.currency.title
  code.value = props.currency.code
  rate.value = props.currency.rate
  main.value = props.currency.main
})

function handleForm() {
  form.value.validate()
  buttonLoading.value = true
  const newCurrency = {
    title: title.value,
    code: code.value,
    rate: rate.value,
    main: main.value,
  }
  if (validation.value) {
    store
      .dispatch('currency/updateCurrency', newCurrency)
      .then(() => {
        emit('ok')
        notification.success(t('currency.update_success'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
</script>

<style lang="scss" scoped>
.confirm-text {
  font-size: 20px;
  min-width: 150px;
  max-width: 300px;
  text-align: center;
}
.confirm-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
