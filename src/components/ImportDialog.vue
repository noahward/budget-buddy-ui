<template>
  <q-card style="min-width: 550px">
    <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
      Import Transactions
    </div>
    <q-card-section>
      <AccountDropdown
        :label="props.label"
        :nickname="props.nickname"
        :value="props.value"
        @account-select="(id) => selectedAccountId=id"
      />

      <div
        v-if="errors.account"
        class="text-red text-caption row justify-start"
      >
        <q-icon
          name="error"
          class="q-mr-xs self-center"
        />
        <span class="self-center">Account is required</span>
      </div>

      <q-file
        v-model="selectedFile"
        filled
        dense
        accept=".csv"
        label="Choose a file"
        class="q-mt-md select"
      />
      <div
        v-if="errors.file || Object.keys(errors.upload).length !== 0"
        class="text-red text-caption row justify-start"
      >
        <q-icon
          name="error"
          class="q-mr-xs self-center"
        />
        <span
          v-if="errors.file"
          class="self-center"
        >Transaction file is required</span>
        <span
          v-for="err in errors.upload"
          :key="err"
          class="self-center"
        >{{ err }}</span>
      </div>
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
    {{ selectedAccountId }}
  </q-card>
</template>

<script setup lang="ts">
import AccountDropdown from 'components/AccountDropdown.vue'
import { camelizeKeys } from 'humps'
import { useAccountStore } from 'stores/account-store'
import { ref } from 'vue'

interface ImportProps {
  label: string;
  nickname?: string;
  value: number;
}

const props = defineProps<ImportProps>()

const selectedAccountId = ref<number | null>(props.value)

const selectedFile = ref<File | null>(null)
const accountStore = useAccountStore()
const uploading = ref(false)

const errors = ref({
  account: false,
  file: false,
  upload: {}
})

const emit = defineEmits(['inFocus', 'closeDialog'])

function uploadFile () {
  uploading.value = true
  if (selectedAccountId.value === null) {
    errors.value.account = true
  } else if (selectedFile.value === null) {
    errors.value.file = true
  } else if (selectedFile.value !== null && selectedAccountId.value !== null) {
    errors.value.file = false
    errors.value.account = false
    return accountStore.uploadTransactions(selectedAccountId.value, selectedFile.value)
      .then(() => {
        emit('closeDialog')
      })
      .catch((error) => {
        errors.value.upload = camelizeKeys(error.response.data)
      })
      .finally(() => {
        uploading.value = false
      })
  }
  uploading.value = false
}
</script>
