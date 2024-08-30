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
          {{ t('global.profile_setting_modal_title') }}
        </div>
        <va-select
          v-model="perPageSelect"
          max-height="105px"
          :label="t('global.profile_setting_per_page')"
          :options="perPageOptions"
          :rules="validators.emptySelectValidator"
        />

        <div class="fc-form__buttons">
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
import { ref, defineEmits, defineProps, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import notification from '@/service/notification'
import validators from '@/service/validators'

const store = useStore()
const { t } = useI18n()
const emit = defineEmits(['ok'])
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const perPageSelect = ref(10)
const perPageOptions = ref([])
const buttonLoading = ref(false)
const validation = ref(null)
const form = ref(null)

const storePerPages = computed(() => {
  return store.state.profile.perPage
})

onMounted(() => {
  initOptions()
  perPageSelect.value = storePerPages?.value
})

function handleForm() {
  form.value.validate()
  if (validation.value) {
    buttonLoading.value = true
    store
      .dispatch('profile/updatePerPage', perPageSelect.value)
      .then(() => {
        emit('ok')
        notification.success(t('global.profile_updated'))
      })
      .finally(() => {
        buttonLoading.value = false
      })
  }
}
function initOptions() {
  perPageOptions.value = [5, 10, 15, 20]
}
</script>

<style lang="scss" scoped></style>
