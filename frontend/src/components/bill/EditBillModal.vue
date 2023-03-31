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
          {{ $t('bill.edit_modal_title') }}
        </div>
        <va-input
          v-model="title"
          type="text"
          :label="t('bill.modal_title')"
          ref="input"
          :rules="validators.emptyValueValidator"
        />
        <va-select
          v-model="selectValue"
          max-height="105px"
          :label="t('bill.modal_currency')"
          :options="selectOptions"
          :rules="validators.emptyValueValidator"
        />

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
import {
  ref,
  watch,
  computed,
  defineEmits,
  defineProps,
  onMounted,
  onUpdated,
  toRaw,
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
  bill: {
    type: Object,
    required: true,
  },
})

const title = ref('')
const selectValue = ref('')
const selectOptions = ref([])
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

const currencies = computed(() => {
  return store.state.profile.currencies
})

onMounted(() => {
  initData()
  initOptions()
})

onUpdated(() => {
  initData()
  initOptions()
})

function handleForm() {
  form.value.validate()
  if (validation.value) {
    buttonLoading.value = true
    const newBill = {
      bill_id: props.bill.id,
      title: title.value,
      currency_code: selectValue.value,
    }
    store
      .dispatch('bill/updateBill', newBill)
      .then(() => {
        emit('ok')
        notification.success(t('bill.update_success'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
function initData() {
  title.value = props.bill.title
  selectValue.value = props.bill.currency_code
}
function initOptions() {
  const list = toRaw(currencies.value)
  list.forEach((item) => {
    return selectOptions.value.push(item.code)
  })
}
watch(currencies, () => {
  initData()
  initOptions()
})
</script>

<style lang="scss" scoped></style>
