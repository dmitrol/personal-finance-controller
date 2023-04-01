<template>
  <div class="app-page">
    <div class="app-page__header fc-flex-right">
      <div>{{ t('record.record_page_title') }}</div>
      <va-button class="fc-ml-3" @click="openCreateModal">{{
        t('global.create_button')
      }}</va-button>
      <va-button
        v-if="showTransferButton"
        class="fc-ml-3"
        @click="showTransferModal = true"
        >{{ t('transfer.add_button') }}</va-button
      >
    </div>
    <div class="app-page__filters">
      <div class="filter-lable">{{ t('record.filters_total_lable') }}</div>
      <div class="filter">
        <va-select
          v-model="selectedType"
          max-height="105px"
          :label="t('record.type_filter_lable')"
          :options="typeOptions"
        />
        <va-select
          class="bill-filter"
          v-model="selectedBill"
          max-height="105px"
          :label="t('record.bill_filter_lable')"
          :options="billOptions"
        />
      </div>
    </div>
    <div class="app-page__list">
      <record-table :records="recordList" @update="resetPage"></record-table>
    </div>

    <div class="app-page__pagination" v-if="totalPage !== 1">
      <va-pagination
        v-model="page"
        :pages="totalPage"
        :visible-pages="3"
        buttons-preset="primary"
        gapped
      />
    </div>

    <create-record-modal
      :show="showModal"
      @ok="closeModal"
      @cancel="showModal = false"
    />
    <create-transfer-modal
      :show="showTransferModal"
      @ok="closeTransferModal"
      @cancel="showTransferModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRaw } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import CreateRecordModal from '@/components/record/CreateRecordModal.vue'
import CreateTransferModal from '@/components/record/CreateTransferModal.vue'
import RecordTable from '@/components/record/RecordTable.vue'

const store = useStore()
const { t } = useI18n({})

const showTransferButton = computed(() => {
  const billsData = store.state.profile.bills
  return billsData.length > 1
})

const bills = computed(() => {
  return store.state.profile.bills
})

const recordList = ref([])
const page = ref(1)
const perPage = ref(4)
const totalPage = ref(1)
const typeOptions = ref([])
const billOptions = ref([])
const selectedType = ref({ text: t('record.type_filter_all'), value: 'all' })
const selectedBill = ref({ text: t('record.bill_filter_all'), value: 'all' })
const showModal = ref(false)
const showTransferModal = ref(false)

onMounted(() => {
  loadData()
  initOptions()
})

function loadData() {
  store.commit('global/setLoader', true)
  const data = {
    page: page.value,
    per_page: perPage.value,
  }
  if (selectedType.value.value !== 'all') {
    data.type = selectedType.value.value
  }
  if (selectedBill.value.value !== 'all') {
    data.bill_id = selectedBill.value.value
  }

  store
    .dispatch('record/getRecords', data)

    .then((data) => {
      recordList.value = data?.data?.data
      totalPage.value = data?.data?.total
    })
    .finally(() => store.commit('global/setLoader', false))
}

function openCreateModal() {
  showModal.value = true
}

function resetPage() {
  if (page.value === 1) {
    loadData()
  } else {
    page.value = 1
  }
}

function closeModal() {
  showModal.value = false
  resetPage()
}

function closeTransferModal() {
  showTransferModal.value = false
  resetPage()
}

function initOptions() {
  typeOptions.value = [
    { text: t('record.type.income'), value: 'income' },
    { text: t('record.type.expense'), value: 'expense' },
    { text: t('record.type_filter_all'), value: 'all' },
  ]
  selectedType.value = { text: t('record.type_filter_all'), value: 'all' }

  billOptions.value = []
  const billList = toRaw(bills.value)
  billOptions.value.push({ text: t('record.bill_filter_all'), value: 'all' })
  billList.forEach((bill) => {
    return billOptions.value.push({ text: bill.title, value: bill.id })
  })
  selectedBill.value = { text: t('record.bill_filter_all'), value: 'all' }
}

watch(page, () => {
  loadData()
})
watch(selectedType, () => {
  loadData()
})
watch(selectedBill, () => {
  loadData()
})
</script>

<style lang="scss" scoped></style>
