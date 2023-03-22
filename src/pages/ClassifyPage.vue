<template>
  <q-page>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-5 column">
          <div class="column">
            <AccountDropdown @account-select="selectAccount" />
            <span
              v-if="selectedAccountId !== null"
              class="text-grey-2 text-caption q-mt-xs"
            >
              {{ unclassifiedTransactions.length }} unclassified transaction{{ unclassifiedTransactions.length !== 1 ? 's' : '' }} for this account
            </span>
          </div>
          <q-card
            v-if="unclassifiedTransactions.length !== 0 && selectedAccountId !== null"
            flat
            class="bg-grey-1 q-mt-md q-pt-sm"
          >
            <span class="text-h6 text-weight-bold q-mx-md">
              Up Next
            </span>
            <q-card-section
              class="column q-my-md"
            >
              <span class="text-caption text-grey-2">
                {{ new Date(unclassifiedTransactions[0].date).toLocaleDateString('en-us', dateOptions) }}
              </span>
              <span class="text-h6 text-weight-medium">
                {{ unclassifiedTransactions[0].description }}
              </span>
              <span
                class="text-weight-bold text-primary q-mt-sm"
                :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'"
              >
                {{ unclassifiedTransactions[0].amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
              </span>
              <span
                v-if="unclassifiedTransactions.length === 0"
                class="text-caption text-grey-2"
              >All transactions have been categorized.</span>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-if="selectedAccountId !== null"
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
              <span
                v-if="classifiedTransactions.length === 0"
                class="text-caption text-grey-2"
              >Nothing to display here.</span>
              <q-card
                v-for="transaction in classifiedTransactions.slice(0,4)"
                :key="transaction.id"
                flat
                class="q-mb-sm"
              >
                <div
                  class="row items-center q-py-sm q-px-md"
                  style="font-size: 13px;"
                >
                  <span class="col-3 text-weight-medium">{{ transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</span>
                  <span class="col-5">{{ transaction.description }}</span>
                  <div class="col-4 row justify-between items-center">
                    <div class="column">
                      <span class="text-primary">{{ transaction.categoryName }}</span>
                      <span class="text-grey-2">{{ transaction.categoryDetailedName }}</span>
                    </div>
                    <a>
                      <q-icon
                        size="14px"
                        name="undo"
                        class="text-grey-2"
                      />
                    </a>
                  </div>
                </div>
              </q-card>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card
        v-if="selectedAccountId !== null"
        flat
        class="bg-grey-1 q-mt-md q-pt-sm"
      >
        <div class="q-my-sm row justify-between">
          <span class="text-subtitle1 text-weight-medium q-mx-md">
            Quick Classify
          </span>
          <q-btn
            flat
            round
            no-caps
            dense
            size="12px"
            class=" bg-grey-2 text-white q-mx-md"
            @click="addDialog = true"
          >
            <q-icon
              name="add"
              size="xs"
            />
          </q-btn>
        </div>

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
                :disable="unclassifiedTransactions.length === 0"
                :class="category.detailedName === 'Other' ? 'bg-secondary text-white' : 'bg-white'"
                :style="category.detailedName === 'Other' ? 'font-size: 14px;' : 'font-size: 13px;'"
                @click="submitClassification(category.id)"
              >
                <span
                  class="q-mx-sm"
                >{{ category.detailedName === 'Other' ? category.name : category.detailedName }}</span>
              </q-btn>
            </div>
          </div>
        </div>
      </q-card>

      <q-dialog
        v-model="addDialog"
        persistent
      >
        <q-card style="min-width: 350px">
          <Form
            :validation-schema="createCategorySchema"
            @submit="createCategory"
          >
            <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
              Add Category
            </div>
            <div>
              <q-checkbox
                v-model="primaryCategory"
                label="Primary category"
                class="q-ml-sm q-mt-md"
              />
            </div>
            <q-card-section class="column">
              <div class="column">
                <div class="text-caption1 text-weight-medium q-mb-xs">
                  Category Name
                </div>
                <InputField
                  kind="text"
                  name="name"
                  :errors="createErrors?.name"
                />
              </div>
              <div class="column">
                <div class="text-caption1 text-weight-medium q-mb-xs">
                  Detailed Name
                </div>
                <InputField
                  kind="text"
                  name="detailedName"
                  :disable="primaryCategory"
                  :errors="createErrors?.detailedName"
                />
              </div>
            </q-card-section>
            <q-card-actions
              align="right"
              class="text-primary"
            >
              <q-btn
                no-caps
                flat
                class="text-grey-2"
                label="Cancel"
                @click="resetForm"
              />
              <q-btn
                no-caps
                flat
                label="Add Account"
                type="submit"
              />
            </q-card-actions>
          </Form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AccountDropdown from 'components/AccountDropdown.vue'
import InputField from 'components/InputField.vue'
import { camelizeKeys } from 'humps'
import { useCategoryStore } from 'stores/category-store'
import { useTransactionStore } from 'stores/transaction-store'
import { Form } from 'vee-validate'
import { computed, ref } from 'vue'
import { object, string } from 'yup'
import { getSubmitFn } from '../helpers/validationHelper'
import { ApiCategoryErrors, Category, CreateCategory } from '../models/category.model'

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric', month: 'short', day: 'numeric'
}

const createCategorySchema = object({
  name: string().required('Category name is required'),
  detailedName: string()
})

const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()
const primaryCategory = ref(false)

categoryStore.getCategories()

const selectedAccountId = ref<number | null>(null)
const addDialog = ref(false)

function selectAccount (id: number) {
  transactionStore.getTransactions(id)
  selectedAccountId.value = id
}

const unclassifiedTransactions = computed(() => {
  return transactionStore.transactions
    .filter(transaction => transaction.dateClassified === null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const classifiedTransactions = computed(() => {
  return transactionStore.transactions
    .filter(transaction => transaction.dateClassified !== null)
    .sort((a, b) => (a.dateClassified && b.dateClassified) ? new Date(a.dateClassified).getTime() - new Date(b.dateClassified).getTime() : 0)
    .reverse()
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

function resetForm () {
  createErrors.value = {}
  primaryCategory.value = false
  addDialog.value = false
}

function submitClassification (categoryId: number) {
  if (selectedAccountId.value !== null) {
    return transactionStore.classifyTransaction(
      selectedAccountId.value,
      unclassifiedTransactions.value[0].id,
      categoryId
    )
  }
}

const createErrors = ref<ApiCategoryErrors>({})

function primaryCatExists (catArr: Array<Array<Category>>, name: string) {
  return catArr.some(innerArr => innerArr.find(obj => obj.name === name && obj.detailedName === 'Other'))
}

const createCategory = getSubmitFn(createCategorySchema, (values) => {
  if (values.detailedName === undefined && !primaryCategory.value) {
    createErrors.value.detailedName = ['Detailed name is required']
    return
  }
  if (primaryCategory.value) {
    values.detailedName = 'Other'
  }

  let newValues: CreateCategory[] | CreateCategory = values
  if (!primaryCatExists(sortedCategories.value, values.name) && !primaryCategory.value && values.detailedName !== 'Other') {
    const mainCategory = { name: values.name, detailedName: 'Other' }
    newValues = [values, mainCategory]
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  categoryStore.createCategory(newValues)
    .then(() => {
      resetForm()
    })
    .catch((error) => {
      createErrors.value = camelizeKeys(error.response.data)
    })
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
