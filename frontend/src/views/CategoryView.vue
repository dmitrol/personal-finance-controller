<template>
  <div class="app-page">
    <div class="app-page__header fc-flex-right">
      <div>{{ t('category.categories_page_title') }}</div>
      <va-button class="fc-ml-3" @click="openCreateModal">{{
        t('global.create_button')
      }}</va-button>
    </div>
    <div class="app-page__list">
      <category-table
        :categories="categoryList"
        @update="resetPage"
      ></category-table>
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

    <create-category-modal
      :show="showModal"
      @ok="closeModal"
      @cancel="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import CreateCategoryModal from '@/components/category/CreateCategoryModal.vue'
import CategoryTable from '@/components/category/CategoryTable.vue'

const store = useStore()
const { t } = useI18n({})

const storePerPages = computed(() => {
  return store.state.profile.perPage
})

const categoryList = ref([])
const page = ref(1)
const perPage = ref(storePerPages.value || 5)
const totalPage = ref(1)
const showModal = ref(false)

onMounted(() => {
  loadData()
})

function loadData() {
  store.commit('global/setLoader', true)
  store
    .dispatch('category/getCategory', {
      page: page.value,
      per_page: perPage.value,
    })
    .then((data) => {
      categoryList.value = data?.data?.data
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
watch(storePerPages, () => {
  perPage.value = storePerPages.value
  loadData()
})
</script>

<style lang="scss" scoped></style>
