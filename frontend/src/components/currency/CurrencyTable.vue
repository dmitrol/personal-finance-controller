<template>
  <div>
    <div>
      <va-scroll-container color="primary" horizontal>
        <div class="fc-table" v-if="props.list.length !== 0">
          <div class="row header">
            <div class="cell">{{ t('currency.table_head.title') }}</div>
            <div class="cell">{{ t('currency.table_head.code') }}</div>
            <div class="cell">{{ t('currency.table_head.rate') }}</div>
            <div class="cell">{{ t('currency.table_head.main') }}</div>
            <div class="cell fc-flex-center">
              {{ t('global.table_head_action') }}
            </div>
          </div>

          <div class="row" v-for="currency in props.list" :key="currency.id">
            <div class="cell">
              {{ currency.title }}
            </div>
            <div class="cell">{{ currency.code }}</div>
            <div class="cell">{{ currency.rate }}</div>
            <div class="cell">{{ currency.main }}</div>
            <div class="cell cell-action">
              <div class="cell-inner">
                <va-button
                  preset="plain"
                  icon="edit"
                  :title="t('global.edit_button')"
                  @click="openEditModal(currency)"
                />
                <va-button
                  preset="plain"
                  icon="delete"
                  :title="t('global.delete_button')"
                  @click="openConfirmModal(currency)"
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

    <edit-currency-form
      :show="editModal"
      :currency="selectedCurrency"
      @ok="closeEditModal"
      @cancel="editModal = false"
    />
    <app-confirm-modal
      :show="removeModal"
      :message="t('global.confirm_ask')"
      @ok="removeCurrency"
      @cancel="removeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import AppConfirmModal from '@/components/AppConfirmModal.vue'
import EditCurrencyForm from '@/components/currency/EditCurrencyForm.vue'
import notification from '@/service/notification'

const store = useStore()
const { t } = useI18n({})

const props = defineProps(['list'])
const emit = defineEmits(['update'])

const editModal = ref(false)
const removeModal = ref(false)
const selectedCurrency = ref({})

function removeCurrency() {
  store
    .dispatch('currency/deleteCurrency', { code: selectedCurrency.value.code })
    .then(() => {
      emit('update')
      notification.success(t('currency.delete_success'))
    })
    .finally(() => {
      removeModal.value = false
    })
}
function openEditModal(currency) {
  selectedCurrency.value = currency
  editModal.value = true
}

function closeEditModal() {
  emit('update')
  editModal.value = false
}

function openConfirmModal(currency) {
  selectedCurrency.value = currency
  removeModal.value = true
}
</script>

<style lang="scss" scoped></style>
