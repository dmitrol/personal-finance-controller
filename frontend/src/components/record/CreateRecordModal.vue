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
          {{ $t('record.create_modal_title') }}
        </div>
        <va-select
          v-model="billSelect"
          max-height="105px"
          :label="t('record.modal_bill')"
          :options="billOptions"
          :rules="validators.emptySelectValidator"
        />
        <va-select
          v-model="typeSelect"
          max-height="105px"
          :label="t('record.modal_type')"
          :options="typeOptions"
          :rules="validators.emptySelectValidator"
        />

        <va-select
          v-model="categorySelect"
          max-height="105px"
          :label="t('record.modal_category')"
          :options="categoryOptions"
          :rules="validators.emptySelectValidator"
        />
        <va-input
          v-model="sum"
          type="number"
          :label="t('record.modal_sum')"
          :rules="validators.sumValidator"
        />
        <va-date-input
          v-model="dateInput"
          :label="t('record.modal_date')"
          manual-input
          placement="top"
        />

        <va-input
          v-model="description"
          type="text"
          :label="t('record.modal_description')"
          ref="input"
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
  computed,
  defineEmits,
  defineProps,
  onMounted,
  watch,
  toRaw,
} from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import notification from '@/service/notification'
import validators from '@/service/validators'
import moment from 'moment'

const store = useStore()
const { t } = useI18n({})
const emit = defineEmits(['ok'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const billSelect = ref('')
const typeSelect = ref('income')
const categorySelect = ref('')
const dateInput = ref(new Date())
const sum = ref(0)
const description = ref('')
const billOptions = ref([])
const typeOptions = ref([
  { text: t('record.type.income'), value: 'income' },
  { text: t('record.type.expense'), value: 'expense' },
])
const selectCategory = ref('')
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

const bills = computed(() => {
  return store.state.profile.bills
})
const categories = computed(() => {
  return store.state.profile.categories
})

const categoryOptions = computed(() => {
  const categoryList = toRaw(categories.value)
  const options = []
  categoryList.forEach((item) => {
    if (typeSelect.value.value === 'income' && item.income) {
      options.push({ text: item.title, value: item.id })
    }
    if (typeSelect.value.value === 'expense' && item.expense) {
      options.push({ text: item.title, value: item.id })
    }
  })
  return options
})

onMounted(() => {
  initOptions()
})

function handleForm() {
  form.value.validate()
  if (validation.value) {
    buttonLoading.value = true
    const newRecord = {
      bill_id: billSelect.value.value,
      category_id: categorySelect.value.value,
      sum: sum.value,
      type: typeSelect.value.value,
      created_at: moment(dateInput.value).format('YYYY-MM-DD'),
      description: description.value,
    }
    store
      .dispatch('record/addRecord', newRecord)
      .then(() => {
        resetModal()
        emit('ok')
        notification.success(t('record.create_success'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
function resetModal() {
  billSelect.value = ''
  categorySelect.value = ''
  sum.value = ''
  dateInput.value = new Date()
  description.value = ''
}
function initOptions() {
  billOptions.value = []
  const billList = toRaw(bills.value)
  billList.forEach((bill) => {
    return billOptions.value.push({ text: bill.title, value: bill.id })
  })
}
watch(bills, () => {
  initOptions()
})
watch(categoryOptions, () => {
  selectCategory.value = ''
})
</script>

<style lang="scss" scoped></style>
