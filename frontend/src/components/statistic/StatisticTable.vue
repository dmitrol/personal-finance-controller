<template>
  <div>
    <div>
      <va-scroll-container color="primary" horizontal>
        <div class="fc-table" v-if="props.data.length !== 0">
          <div class="row header">
            <div class="cell">{{ t('statistic.table_head.title') }}</div>
            <div class="cell">{{ t('statistic.table_head.income') }}</div>
            <div class="cell">{{ t('statistic.table_head.expense') }}</div>
            <div class="cell">{{ t('statistic.table_head.total') }}</div>
            <div class="cell">{{ t('statistic.table_head.currency') }}</div>
            <div class="cell">
              {{
                t('statistic.table_head.main_currecy', {
                  currency: mainCurrency.code,
                })
              }}
            </div>
          </div>

          <div class="row" v-for="item in props.data" :key="item.id">
            <div class="cell">
              {{ item.title }}
            </div>
            <div class="cell">{{ item.income }}</div>
            <div class="cell">{{ item.expense }}</div>
            <div class="cell">{{ item.total }}</div>
            <div class="cell">{{ item.currency }}</div>
            <div class="cell">
              {{ inMainCurrency(item.total, item.currency) }}
            </div>
          </div>
        </div>
        <div class="empty-list" v-else>
          {{ t('global.empty_list') }}
        </div>
      </va-scroll-container>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, toRaw } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n({})

const props = defineProps(['data'])

const mainCurrency = computed(() => {
  return store.state.profile.mainCurrency
})

const currencies = computed(() => {
  return store.state.profile.currencies
})

function inMainCurrency(sum, currency) {
  const list = toRaw(currencies.value)
  const result = list.find((item) => item.code === currency)
  return (sum * result.rate).toFixed(2)
}
</script>

<style lang="scss" scoped></style>
