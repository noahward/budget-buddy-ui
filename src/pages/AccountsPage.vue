<template>
  <q-page>
    <div class="container">
      <div class="q-mt-lg q-mb-sm row justify-between">
        <span
          class="text-h6 text-weight-medium"
          :class="{ 'q-ml-sm': $q.screen.gt.xs }"
        >Spending</span>
        <q-btn
          flat
          no-caps
          dense
          class=" bg-secondary text-white"
          :class="{ 'q-ml-lg': $q.screen.gt.xs }"
          @click="addDialog = true; accountType = 'spending'"
        >
          <q-icon
            name="add"
            size="xs"
          />
          <span class="q-mx-sm">Add Account</span>
        </q-btn>
      </div>
      <div>
        <span
          v-if="spendingAccounts.length === 0"
          class="q-ml-sm text-grey-2"
        >No spending accounts to display!</span>
        <account-card
          v-for="account in spendingAccounts"
          :id="account.id"
          :key="account.id"
          :name="account.name"
          :nickname="account.nickname"
          :balance="account.balance"
          kind="spending"
          class="q-my-xs"
        />
      </div>

      <div class="q-mt-lg q-mb-sm row justify-between">
        <span
          class="text-h6 text-weight-medium"
          :class="{ 'q-ml-sm': $q.screen.gt.xs }"
        >Saving</span>
        <q-btn
          flat
          no-caps
          dense
          class=" bg-secondary text-white"
          :class="{ 'q-ml-lg': $q.screen.gt.xs }"
          @click="addDialog = true; accountType = 'saving'"
        >
          <q-icon
            name="add"
            size="xs"
          />
          <span class="q-mx-sm">Add Account</span>
        </q-btn>
      </div>
      <div>
        <span
          v-if="savingAccounts.length === 0"
          class="q-ml-sm text-grey-2"
        >No saving accounts to display!</span>
        <account-card
          v-for="account in savingAccounts"
          :id="account.id"
          :key="account.id"
          :name="account.name"
          :nickname="account.nickname"
          :balance="account.balance"
          kind="saving"
          class="q-my-xs"
        />
      </div>

      <q-dialog
        v-model="addDialog"
        persistent
      >
        <q-card style="min-width: 350px">
          <Form
            :validation-schema="createAccountSchema"
            @submit="createAccount"
          >
            <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
              Add Account
            </div>
            <q-card-section class="column">
              <q-option-group
                v-model="accountType"
                :options="accountOptions"
                color="primary"
                inline
                class="q-mb-md"
              />
              <div class="column">
                <div class="text-caption1 text-weight-medium q-mb-xs">
                  Account Name
                </div>
                <InputField
                  kind="text"
                  name="name"
                  :errors="updateErrors?.name"
                />
              </div>
              <div class="column">
                <div class="text-caption1 text-weight-medium q-mb-xs">
                  Nickname
                </div>
                <InputField
                  kind="text"
                  name="nickname"
                  :errors="updateErrors?.nickname"
                />
              </div>
              <div class="column">
                <div class="text-caption1 text-weight-medium q-mb-xs">
                  Initial Balance
                </div>
                <InputField
                  kind="text"
                  name="initialBalance"
                  :errors="updateErrors?.initialBalance"
                />
              </div>
            </q-card-section>
            <q-card-actions
              align="right"
              class="text-primary"
            >
              <q-btn
                v-close-popup
                no-caps
                flat
                class="text-grey-2"
                label="Cancel"
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
import InputField from 'components/InputField.vue'
import { camelizeKeys } from 'humps'
import AccountCard from 'src/components/AccountCard.vue'
import { useAccountStore } from 'stores/account-store'
import { Form } from 'vee-validate'
import { computed, ref } from 'vue'
import { number, object, string } from 'yup'
import { getSubmitFn } from '../helpers/validationHelper'
import { ApiAccountErrors } from '../models/account.model'

const createAccountSchema = object({
  name: string().required('Account name is required'),
  nickname: string(),
  initialBalance: number(),
  kind: string<'saving' | 'spending'>()
})

const accountStore = useAccountStore()
const addDialog = ref(false)
const accountType = ref<'saving' | 'spending'>('spending')
const accountOptions = [
  { label: 'Spending', value: 'spending' },
  { label: 'Saving', value: 'saving' }
]

accountStore.getAccounts()

const spendingAccounts = computed(() => {
  return accountStore.accounts.filter(account => account.kind === 'spending')
})

const savingAccounts = computed(() => {
  return accountStore.accounts.filter(account => account.kind === 'saving')
})

const updateErrors = ref<ApiAccountErrors>()

const createAccount = getSubmitFn(createAccountSchema, (values) => {
  values.kind = accountType.value
  accountStore.createAccount(values)
    .then(() => {
      addDialog.value = false
    })
    .catch((error) => {
      updateErrors.value = camelizeKeys(error.response.data)
    })
})
</script>

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}
</style>
