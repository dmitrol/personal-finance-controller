<template>
  <div>
    <div>
      <va-scroll-container color="primary" horizontal>
        <div class="fc-table record-table" v-if="props.records.length !== 0">
          <div class="row header">
            <div class="cell">{{ t('record.table_head.bill') }}</div>
            <div class="cell">{{ t('record.table_head.category') }}</div>
            <div class="cell">{{ t('record.table_head.type') }}</div>
            <div class="cell">{{ t('record.table_head.sum') }}</div>
            <div class="cell">
              {{ t('record.table_head.transfer_rate') }}
            </div>
            <div class="cell">{{ t('record.table_head.date') }}</div>
            <div class="cell">{{ t('record.table_head.description') }}</div>
            <div class="cell fc-flex-center">
              {{ t('global.table_head_action') }}
            </div>
          </div>

          <div class="row" v-for="record in props.records" :key="record.id">
            <div class="cell">
              {{ record.bill.title }}
            </div>
            <div class="cell">
              {{ record?.category?.title || t('transfer.type_transfer') }}
            </div>
            <div class="cell">
              {{ t('record.type.' + record.type) }}
            </div>
            <div class="cell">{{ record.sum }}</div>
            <div class="cell">{{ record?.transfer?.rate || '-' }}</div>
            <div class="cell">
              {{ moment(record?.created_at).format('DD-MM-YYYY') }}
            </div>
            <div class="cell">{{ record.description || '-' }}</div>
            <div class="cell cell-action">
              <div class="cell-inner">
                <va-button
                  preset="plain"
                  icon="edit"
                  :title="t('global.edit_button')"
                  @click="openEditModal(record)"
                />
                <va-button
                  preset="plain"
                  icon="delete"
                  :title="t('global.delete_button')"
                  @click="openConfirmModal(record)"
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

    <edit-record-modal
      :show="showEditModal"
      :record="selectedRecord"
      @ok="closeRecordEditModal"
      @cancel="showEditModal = false"
    />
    <edit-transfer-modal
      :show="showTransferModal"
      :fromRecord="selectedTransfer.fromRecord"
      :toRecord="selectedTransfer.toRecord"
      @ok="closeTransferEditModal"
      @cancel="showTransferModal = false"
    />
    <app-confirm-modal
      :show="removeModal"
      :message="t('global.confirm_ask')"
      @ok="removeRecord"
      @cancel="removeModal = false"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import AppConfirmModal from '@/components/AppConfirmModal.vue'
import EditRecordModal from '@/components/record/EditRecordModal.vue'
import EditTransferModal from '@/components/record/EditTransferModal.vue'
import notification from '@/service/notification'

moment().format()
const store = useStore()
const { t } = useI18n({})

const props = defineProps(['records'])
const emit = defineEmits(['update'])

const showEditModal = ref(false)
const showTransferModal = ref(false)
const removeModal = ref(false)
const selectedRecord = ref({})
const selectedTransfer = ref({})

function removeRecord() {
  if (!selectedRecord.value.transfer) {
    store
      .dispatch('record/deleteRecord', {
        record_id: selectedRecord.value.id,
      })
      .then(() => {
        emit('update')
        notification.success(t('record.delete_success'))
      })
      .finally(() => {
        removeModal.value = false
      })
  } else {
    removeTransfer()
  }
}
function removeTransfer() {
  store
    .dispatch('transfer/deleteTransfer', {
      transfer_id: selectedRecord.value.transfer.id,
    })
    .then(() => {
      emit('update')
      notification.success(t('transfer.delete_success'))
    })
    .finally(() => {
      removeModal.value = false
    })
}

function openEditModal(record) {
  if (record.transfer) {
    store.dispatch('transfer/getTransfer', record.transfer.id).then((data) => {
      if (data.data) {
        selectedTransfer.value = {
          fromRecord: data.data[0],
          toRecord: data.data[1],
        }
        showTransferModal.value = true
      }
    })
  } else {
    selectedRecord.value = record
    showEditModal.value = true
  }
}

function openConfirmModal(bill) {
  selectedRecord.value = bill
  removeModal.value = true
}
function closeRecordEditModal() {
  emit('update')
  showEditModal.value = false
}
function closeTransferEditModal() {
  emit('update')
  showTransferModal.value = false
}
</script>

<style lang="scss" scoped></style>
