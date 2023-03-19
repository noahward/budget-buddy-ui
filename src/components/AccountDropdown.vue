<template>
  <q-select
    v-model="selectedAccount"
    filled
    dense
    label="Select an account"
    class="q-mt-md"
    :options="accountOptions"
    @filter="filterAccounts"
    @update:model-value="$emit('accountSelect', selectedAccount.value)"
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
</template>

<script setup lang="ts">
import { useAccountStore } from 'stores/account-store'
import { computed, ref } from 'vue'

interface ImportProps {
  label?: string;
  nickname?: string;
  value?: number;
}

const props = defineProps<ImportProps>()
defineEmits(['change', 'accountSelect'])

const selectedAccount = ref({
  label: props.label,
  nickname: props.nickname,
  value: props.value
})

const accountStore = useAccountStore()

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
</script>
