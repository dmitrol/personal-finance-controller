<template>
  <div>
    <div>
      <va-scroll-container color="primary" horizontal>
        <div class="fc-table" v-if="props.categories.length !== 0">
          <div class="row header">
            <div class="cell">{{ t('category.table_head.title') }}</div>
            <div class="cell">{{ t('category.table_head.type') }}</div>
            <div class="cell fc-flex-center">
              {{ t('global.table_head_action') }}
            </div>
          </div>

          <div
            class="row"
            v-for="category in props.categories"
            :key="category.id"
          >
            <div class="cell">
              {{ category.title }}
            </div>
            <div class="cell">{{ resolveCategoryType(category) }}</div>
            <div class="cell cell-action">
              <div class="cell-inner">
                <va-button
                  preset="plain"
                  icon="edit"
                  :title="t('global.edit_button')"
                  @click="openEditModal(category)"
                />
                <va-button
                  preset="plain"
                  icon="delete"
                  :title="t('global.delete_button')"
                  @click="openConfirmModal(category)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="empty-list" v-else>
          {{ t('global.empty_list') }}
        </div>
      </va-scroll-container>
    </div>

    <edit-category-modal
      :show="editModal"
      :category="selectedCategory"
      @ok="closeEditModal"
      @cancel="editModal = false"
    />
    <app-confirm-modal
      :show="removeModal"
      :message="t('global.confirm_ask')"
      @ok="removeCategory"
      @cancel="removeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import AppConfirmModal from '@/components/AppConfirmModal.vue'
import EditCategoryModal from '@/components/category/EditCategoryModal.vue'
import notification from '@/service/notification'

const store = useStore()
const { t } = useI18n({})

const props = defineProps(['categories'])
const emit = defineEmits(['update'])

const editModal = ref(false)
const removeModal = ref(false)
const selectedCategory = ref({})

function removeCategory() {
  store
    .dispatch('category/deleteCategory', {
      category_id: selectedCategory.value.id,
    })
    .then(() => {
      emit('update')
      notification.success(t('category.delete_success'))
    })
    .finally(() => {
      removeModal.value = false
    })
}

function resolveCategoryType(category) {
  if (category.income && category.expense) {
    return t('category.type.universal')
  } else if (category.income) {
    return t('category.type.income')
  } else {
    return t('category.type.expense')
  }
}

function openEditModal(currency) {
  selectedCategory.value = currency
  editModal.value = true
}

function closeEditModal() {
  emit('update')
  editModal.value = false
}

function openConfirmModal(currency) {
  selectedCategory.value = currency
  removeModal.value = true
}
</script>

<style lang="scss" scoped></style>
