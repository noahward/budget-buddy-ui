<template>
  <q-page>
    <div class="container">
      <q-select
        v-model="selectedAccount"
        filled
        dense
        label="Select an account"
        class="q-mt-md select"
        :options="accountOptions"
        @filter="filterAccounts"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>
                {{ scope.opt.nickname }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey-2">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-file
        v-model="selectedFile"
        filled
        dense
        accept=".csv"
        label="Choose a file"
        class="q-mt-md select"
      />

      <q-btn
        flat
        dense
        :loading="uploading"
        no-caps
        class="text-white bg-primary q-mt-md"
        @click="uploadFile"
      >
        <span class="q-mx-sm">Upload</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { camelizeKeys } from 'humps'
import { useAccountStore } from 'stores/account-store'
import { computed, ref } from 'vue'

const accountStore = useAccountStore()

interface AccountOption {
  label: string;
  nickname?: string;
  value: number;
}

const selectedAccount = ref<AccountOption | null>(null)
const selectedFile = ref<File | null>(null)

const uploading = ref(false)

const accountOptions = computed(() => {
  const options = []
  for (let i = 0; i < accountStore.accounts.length; i++) {
    const accOption = {
      label: accountStore.accounts[i].name,
      nickname: accountStore.accounts[i].nickname,
      value: accountStore.accounts[i].id
    }
    options.push(accOption)
  }
  return options
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
function filterAccounts (_val: unknown, update: any, _abort: unknown) {
  if (accountOptions.value.length !== 0) {
    return update()
  }

  update(async () => {
    try {
      return await accountStore.getAccounts()
    } catch (error) {
      console.error(error)
    }
  })
}

const accountError = ref(false)
const fileError = ref(false)
const updateErrors = ref()

function uploadFile () {
  uploading.value = true
  if (selectedAccount.value === null) {
    accountError.value = true
  }
  if (selectedFile.value === null) {
    fileError.value = true
  }
  if (selectedFile.value !== null && selectedAccount.value !== null) {
    return accountStore.uploadTransactions(selectedAccount.value.value, selectedFile.value)
      .catch((error) => {
        updateErrors.value = camelizeKeys(error.response.data)
      })
      .finally(() => {
        uploading.value = false
      })
  }
  uploading.value = false
}
</script>

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}

.select {
  @media (min-width: 600px) {
    width: 300px;
  }
}
</style>
