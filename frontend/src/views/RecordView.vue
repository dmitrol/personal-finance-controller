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
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import CreateRecordModal from '@/components/record/CreateRecordModal.vue'
import CreateTransferModal from '@/components/record/CreateTransferModal.vue'
import RecordTable from '@/components/record/RecordTable.vue'

const store = useStore()
const { t } = useI18n({})

const showTransferButton = computed(() => {
  const bills = store.state.profile.bills
  return bills.length > 1
})

const recordList = ref([])
const page = ref(1)
const perPage = ref(4)
const totalPage = ref(1)
const showModal = ref(false)
const showTransferModal = ref(false)

onMounted(() => {
  loadData()
})

function loadData() {
  store.commit('global/setLoader', true)
  store
    .dispatch('record/getRecords', {
      page: page.value,
      per_page: perPage.value,
    })
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

watch(page, () => {
  loadData()
})
</script>

<style lang="scss" scoped></style>
