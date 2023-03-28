<template>
  <div>
    <div>
      <va-scroll-container color="primary" horizontal>
        <div class="fc-table" v-if="props.bills.length !== 0">
          <div class="row header">
            <div class="cell">{{ t('bill.table_head.title') }}</div>
            <div class="cell">{{ t('bill.table_head.currency') }}</div>
            <div class="cell fc-flex-center">
              {{ t('global.table_head_action') }}
            </div>
          </div>

          <div class="row" v-for="bill in props.bills" :key="bill.id">
            <div class="cell">
              {{ bill.title }}
            </div>
            <div class="cell">{{ bill.currency_code }}</div>
            <div class="cell cell-action">
              <div class="cell-inner">
                <va-button
                  preset="plain"
                  icon="edit"
                  :title="t('global.edit_button')"
                  @click="openEditModal(bill)"
                />
                <va-button
                  preset="plain"
                  icon="delete"
                  :title="t('global.delete_button')"
                  @click="openConfirmModal(bill)"
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

    <edit-bill-modal
      :show="editModal"
      :bill="selectedBill"
      @ok="closeEditModal"
      @cancel="editModal = false"
    />
    <app-confirm-modal
      :show="removeModal"
      :message="t('global.confirm_ask')"
      @ok="removeBill"
      @cancel="removeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import AppConfirmModal from '@/components/AppConfirmModal.vue'
import EditBillModal from '@/components/bill/EditBillModal.vue'
import notification from '@/service/notification'

const store = useStore()
const { t } = useI18n({})

const props = defineProps(['bills'])
const emit = defineEmits(['update'])

const editModal = ref(false)
const removeModal = ref(false)
const selectedBill = ref({})

function removeBill() {
  store
    .dispatch('bill/deleteBill', {
      bill_id: selectedBill.value.id,
    })
    .then(() => {
      emit('update')
      notification.success(t('bill.delete_success'))
    })
    .finally(() => {
      removeModal.value = false
    })
}

function openEditModal(bill) {
  selectedBill.value = bill
  editModal.value = true
}

function closeEditModal() {
  emit('update')
  editModal.value = false
}

function openConfirmModal(bill) {
  selectedBill.value = bill
  removeModal.value = true
}
</script>

<style lang="scss" scoped></style>
