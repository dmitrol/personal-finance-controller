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
          {{ $t('transfer.create_modal_title') }}
        </div>
        <va-select
          v-model="fromBillSelect"
          max-height="105px"
          :label="t('transfer.modal_from_bill')"
          :options="billOptions"
          :rules="validators.emptySelectValidator"
        />
        <va-select
          v-model="toBillSelect"
          max-height="105px"
          :label="t('transfer.modal_to_bill')"
          :options="billOptions"
          :rules="validators.compareBillValidator(fromBillSelect.text)"
        />
        <va-input
          v-model="fromSum"
          type="number"
          :label="t('transfer.modal_from_sum')"
          :rules="validators.sumValidator"
        />
        <va-input
          v-model="toSum"
          type="number"
          :label="t('transfer.modal_to_sum')"
          :rules="validators.sumValidator"
          :disabled="disabledRate"
        />

        <va-input
          v-model="rate"
          type="number"
          :label="t('transfer.modal_rate')"
          :rules="validators.sumValidator"
          :disabled="disabledRate"
        />
        <va-date-input
          v-model="dateInput"
          :label="t('transfer.modal_date')"
          manual-input
          placement="top"
        />

        <va-input
          v-model="description"
          type="text"
          :label="t('transfer.modal_description')"
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
  onUpdated,
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
  fromRecord: {
    type: Object,
    default: null,
  },
  toRecord: {
    type: Object,
    default: null,
  },
})

const fromBillSelect = ref('')
const toBillSelect = ref('')
const fromSum = ref(0)
const toSum = ref(0)
const rate = ref(1)
const dateInput = ref(new Date())
const description = ref('')
const billOptions = ref([])
const disabledRate = ref(true)
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

const bills = computed(() => {
  return store.state.profile.bills
})
const currencies = computed(() => {
  return store.state.profile.currencies
})

onMounted(() => {
  initOptions()
  initModalData()
})

onUpdated(() => {
  initOptions()
  initModalData()
})

function handleForm() {
  form.value.validate()
  if (validation.value) {
    buttonLoading.value = true
    const newRecord = {
      from_bill_id: fromBillSelect.value.value,
      to_bill_id: toBillSelect.value.value,
      from_sum: fromSum.value,
      to_sum: toSum.value,
      transfer_rate: rate.value,
      created_at: moment(dateInput.value).format('YYYY-MM-DD'),
      description: description.value,
    }
    store
      .dispatch('transfer/addTransfer', newRecord)
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
  fromBillSelect.value = ''
  toBillSelect.value = ''
  fromSum.value = 0
  toSum.value = 0
  rate.value = 1
  dateInput.value = new Date()
  description.value = ''
}
function initOptions() {
  billOptions.value = []
  const billList = toRaw(bills.value)
  billList.forEach((bill) => {
    return billOptions.value.push({
      text: bill.title,
      value: bill.id,
      currencyCode: bill.currency_code,
    })
  })
}
function initModalData() {
  if (!!props.fromRecord && !!props.fromRecord) {
    fromBillSelect.value = {
      text: props.fromRecord?.bill?.title,
      value: props.fromRecord?.bill?.id,
      currencyCode: props.fromRecord?.bill?.currency_code,
    }
    toBillSelect.value = {
      text: props.toRecord?.bill?.title,
      value: props.toRecord?.bill?.id,
      currencyCode: props.toRecord?.bill?.currency_code,
    }
    fromSum.value = props.fromRecord?.sum
    toSum.value = props.toRecord?.sum
    rate.value = props.fromRecord?.transfer?.rate
    dateInput.value = moment(props.fromRecord?.created_at).format('YYYY-MM-DD')
    description.value = props.fromRecord?.description
    if (rate.value === 1) {
      disabledRate.value = false
    } else {
      disabledRate.value = true
    }
  }
}
function calcRate() {
  if (fromBillSelect.value && toBillSelect.value) {
    if (fromBillSelect.value.currencyCode === toBillSelect.value.currencyCode) {
      rate.value = 1
      disabledRate.value = true
    } else {
      const currencyList = toRaw(currencies.value)
      let fromRate = 1
      let toRate = 1
      currencyList.forEach((currency) => {
        if (currency.code === fromBillSelect.value.currencyCode) {
          fromRate = currency.rate
        }
        if (currency.code === toBillSelect.value.currencyCode) {
          toRate = currency.rate
        }
      })
      rate.value = +(toRate / fromRate).toFixed(5)
      disabledRate.value = false
    }
  }
}
watch(bills, () => {
  initOptions()
})
watch(fromBillSelect, () => {
  calcRate()
})
watch(toBillSelect, () => {
  calcRate()
})
watch(fromSum, () => {
  if (fromSum.value) {
    toSum.value = +(fromSum.value * rate.value).toFixed(5)
  }
})
watch(toSum, () => {
  if (toSum.value) {
    rate.value = +(toSum.value / fromSum.value).toFixed(5)
  }
})
watch(rate, () => {
  if (rate.value) {
    toSum.value = +(fromSum.value * rate.value).toFixed(5)
  }
})
</script>

<style lang="scss" scoped></style>
