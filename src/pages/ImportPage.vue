<template>
  <q-page>
    <div class="container">
      <q-select
        v-model="selectedAccount"
        filled
        dense
        label="Account"
        class="q-mt-md"
        style="width: 500px"
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAccountStore } from 'stores/account-store'
import { computed, ref } from 'vue'

const accountStore = useAccountStore()
const selectedAccount = ref(null)

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

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}
</style>
