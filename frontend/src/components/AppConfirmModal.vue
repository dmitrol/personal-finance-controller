<template>
  <va-modal :mobile-fullscreen="false" :model-value="props.show" size="small">
    <template #content="{ ok, cancel }">
      <div class="confirm-text">{{ props.message }}</div>
      <div class="confirm-buttons">
        <va-button class="fc-mr-1" color="primary" @click="ok">{{
          t('global.button_ok')
        }}</va-button>
        <va-button class="fc-ml-1" color="danger" @click="cancel">
          {{ t('global.button_cancel') }}
        </va-button>
      </div>
    </template>
  </va-modal>
</template>

<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({})
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.confirm-text {
  font-size: 20px;
  min-width: 150px;
  max-width: 300px;
  text-align: center;
}
.confirm-buttons {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
