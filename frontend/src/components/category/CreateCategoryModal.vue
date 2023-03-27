<template>
  <va-modal
    class="fc-modal"
    :mobile-fullscreen="false"
    :model-value="props.show"
    size="small"
  >
    <template #content="{ cancel }">
      <va-form
        class="fc-form"
        tag="form"
        ref="form"
        @keyup.enter="handleForm"
        @validation="validation = $event"
      >
        <div class="fc-form__title">
          {{ $t('category.create_modal_title') }}
        </div>
        <va-input
          v-model="title"
          type="text"
          :label="t('category.modal_title')"
          ref="input"
          :rules="validators.emptyValueValidator"
        />
        <va-select
          v-model="selectValue"
          :label="t('category.modal_type')"
          :options="selectOptions"
          :rules="validators.emptyValueValidator"
        />

        <div class="fc-flex-center">
          <va-button
            class="fc-mr-1"
            color="primary"
            :loading="buttonLoading"
            @click="handleForm"
          >
            {{ t('global.button_ok') }}
          </va-button>
          <va-button class="fc-ml-1" color="danger" @click="cancel">
            {{ t('global.button_cancel') }}
          </va-button>
        </div>
      </va-form>
    </template>
  </va-modal>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import notification from '@/service/notification'
import validators from '@/service/validators'

const store = useStore()
const { t } = useI18n({})
const emit = defineEmits(['ok'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const title = ref('')
const selectValue = ref('')
const selectOptions = ref([
  t('category.type.income'),
  t('category.type.expense'),
  t('category.type.universal'),
])
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

function handleForm() {
  form.value.validate()
  if (validation.value) {
    buttonLoading.value = true
    const newCategory = {
      title: title.value,
      income: false,
      expense: false,
    }
    if (selectValue.value === t('category.type.universal')) {
      newCategory.income = true
      newCategory.expense = true
    } else if (selectValue.value === t('category.type.income')) {
      newCategory.income = true
    } else {
      newCategory.expense = true
    }
    store
      .dispatch('category/addCategory', newCategory)
      .then(() => {
        resetModal()
        emit('ok')
        notification.success(t('category.create_success'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
function resetModal() {
  title.value = ''
  selectValue.value = ''
}
</script>

<style lang="scss" scoped></style>
