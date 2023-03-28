<template>
  <div class="app-page">
    <div class="app-page__header fc-flex-right">
      <div>{{ t('bill.bills_page_title') }}</div>
      <va-button class="fc-ml-3" @click="openCreateModal">{{
        t('global.create_button')
      }}</va-button>
    </div>
    <div class="app-page__list">
      <bill-table :bills="billList" @update="resetPage"></bill-table>
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

    <create-bill-modal
      :show="showModal"
      @ok="closeModal"
      @cancel="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import CreateBillModal from '@/components/bill/CreateBillModal.vue'
import BillTable from '@/components/bill/BillTable.vue'

const store = useStore()
const { t } = useI18n({})

const billList = ref([])
const page = ref(1)
const perPage = ref(4)
const totalPage = ref(1)
const showModal = ref(false)

onMounted(() => {
  loadData()
})

function loadData() {
  store.commit('global/setLoader', true)
  store
    .dispatch('bill/getBill', {
      page: page.value,
      per_page: perPage.value,
    })
    .then((data) => {
      billList.value = data?.data?.data
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

watch(page, () => {
  loadData()
})
</script>

<style lang="scss" scoped></style>
