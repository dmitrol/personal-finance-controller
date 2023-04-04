<template>
  <div class="app-page">
    <div class="app-page__header fc-flex-right">
      <div>{{ t('statistic.statistic_page_title') }}</div>
    </div>
    <div class="app-page__list">
      <statistic-table :data="statisticData" />
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import StatisticTable from '@/components/statistic/StatisticTable.vue'

const store = useStore()
const { t } = useI18n({})

const storePerPages = computed(() => {
  return store.state.profile.perPage
})

const statisticData = ref([])
const page = ref(1)
const perPage = ref(storePerPages.value || 5)
const totalPage = ref(1)

onMounted(() => {
  loadData()
})

function loadData() {
  store.commit('global/setLoader', true)
  store
    .dispatch('statistic/getStatisticByBills', {
      page: page.value,
      per_page: perPage.value,
    })
    .then((data) => {
      statisticData.value = data?.data?.data
      totalPage.value = data?.data?.total
    })
    .finally(() => store.commit('global/setLoader', false))
}

watch(page, () => {
  loadData()
})
watch(storePerPages, () => {
  perPage.value = storePerPages.value
  loadData()
})
</script>

<style lang="scss" scoped></style>
