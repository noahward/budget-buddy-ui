<template>
  <q-card style="min-width: 550px">
    <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
      Import Transactions
    </div>
    <q-card-section>
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
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-close-popup
        no-caps
        flat
        label="Cancel"
        color="grey-2"
      />
      <q-btn
        no-caps
        flat
        label="Upload"
        color="primary"
        :loading="uploading"
        @click="uploadFile"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { camelizeKeys } from 'humps'
import { useAccountStore } from 'stores/account-store'
import { computed, ref } from 'vue'

interface ImportProps {
  label: string;
  nickname?: string;
  value: number;
}

const props = defineProps<ImportProps>()

const selectedAccount = ref({
  label: props.label,
  nickname: props.nickname,
  value: props.value
})

const selectedFile = ref<File | null>(null)
const accountStore = useAccountStore()
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

const emit = defineEmits(['inFocus', 'closeDialog'])

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
        emit('closeDialog')
      })
  }
  uploading.value = false
}
</script>
