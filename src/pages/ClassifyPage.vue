<template>
  <q-page>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-5 column">
          <div class="column">
            <AccountDropdown @account-select="(id) => transactionStore.getTransactions(id)" />
            <span class="text-grey-2 text-caption q-mt-xs">
              {{ nullCategoryCount }} unclassified transaction{{ nullCategoryCount !== 1 ? 's' : '' }} for this account
            </span>
          </div>
          <q-card
            flat
            class="bg-grey-1 q-mt-md q-pt-sm"
          >
            <span class="text-h6 text-weight-bold q-mx-md">
              Up Next
            </span>
            <q-card-section class="column q-mb-sm">
              <span class="text-caption text-grey-2">February 6, 2023</span>
              <span class="text-subtitle1 text-weight-medium">Sony Inter 3.35_V</span>
              <span
                class="text-weight-bold text-primary q-mt-sm"
                :class="$q.screen.lt.sm ? 'text-h6' : 'text-h5'"
              >-$90.66</span>
            </q-card-section>
          </q-card>
        </div>

        <div
          class="col-12 col-sm q-mt-md"
          :class="{ 'q-ml-md': $q.screen.gt.xs }"
        >
          <q-card
            flat
            class="bg-grey-1 q-pt-sm"
          >
            <span class="text-subtitle1 text-weight-medium q-mx-md">
              Recently Classified
            </span>
            <q-card-section>
              <q-card
                v-for="x in 4"
                :key="x"
                flat
                class="q-mb-sm"
              >
                <div class="q-pa-sm">
                  Test
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card
        flat
        class="bg-grey-1 q-mt-md q-pt-sm"
      >
        <span class="text-subtitle1 text-weight-medium q-mx-md">
          Quick Classify
        </span>
        <div class="row">
          <div
            v-for="(categoryArr, index) in sortedCategories"
            :key="index"
            class="grid-col q-px-md q-pb-md q-pt-sm"
          >
            <div
              v-for="category in categoryArr"
              :key="category.id"
            >
              <q-btn
                flat
                no-caps
                dense
                align="left"
                class="column q-my-sm full-width"
                :class="category.detailedName === 'Other' ? 'bg-secondary text-white' : 'bg-white'"
                :style="category.detailedName === 'Other' ? 'font-size: 14px;' : 'font-size: 13px;'"
              >
                <span
                  class="q-mx-sm"
                >{{ category.detailedName === 'Other' ? category.name : category.detailedName }}</span>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AccountDropdown from 'components/AccountDropdown.vue'
import { useCategoryStore } from 'stores/category-store'
import { useTransactionStore } from 'stores/transaction-store'
import { computed } from 'vue'
import { Category } from '../models/category.model'

const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()

categoryStore.getCategories()

const nullCategoryCount = computed(() => {
  const filtered = transactionStore.transactions.filter((itm) => {
    return itm.category === null
  })
  return filtered.length
})

const sortedTransactions = computed(() => {
  const transactions = transactionStore.transactions

  transactions.forEach(obj => {
    if (obj.date !== null) {
      obj.date = new Date(obj.date)
    }
    if (obj.dateClassified !== null) {
      obj.dateClassified = new Date(obj.dateClassified)
    }
  })

  transactions.sort((a, b) => {
    if (a.dateClassified === null && b.dateClassified === null) {
      if (a.date === null && b.date === null) {
        return 0
      }
      if (a.date === null) {
        return -1
      }
      if (b.date === null) {
        return 1
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    if (a.dateClassified === null) {
      return -1
    }
    if (b.dateClassified === null) {
      return 1
    }
    return new Date(a.dateClassified).getTime() - new Date(b.dateClassified).getTime()
  })

  console.log(transactions)
  return transactions
})

const sortedCategories = computed(() => {
  const sorted: Array<Array<Category>> = []
  const uniqueCategories = [...new Set(categoryStore.categories.map(cat => cat.name))]
  uniqueCategories.forEach((category) => {
    const subCategories = categoryStore.categories.filter((itm) => {
      return itm.name === category
    })
    subCategories.sort((a, b) => {
      if (a.detailedName === 'Other') {
        return -1
      } else if (b.detailedName === 'Other') {
        return 1
      } else {
        return 0
      }
    })
    sorted.push(subCategories)
  })
  return sorted
})
</script>

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}

.grid-col {
  width: 20%;
  @media (max-width: 700px) {
    width: 50%;
  }
}
</style>
