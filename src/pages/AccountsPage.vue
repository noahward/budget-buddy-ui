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
        >
          <q-icon
            name="add"
            size="xs"
          />
          <span class="q-mx-sm">Add Account</span>
        </q-btn>
      </div>
      <div>
        <content-card
          v-for="account in spendingAccounts"
          :key="account.id"
          :name="account.name"
          :nickname="account.nickname"
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
        >
          <q-icon
            name="add"
            size="xs"
          />
          <span class="q-mx-sm">Add Account</span>
        </q-btn>
      </div>
      <div>
        <content-card
          v-for="account in savingAccounts"
          :key="account.id"
          :name="account.name"
          :nickname="account.nickname"
          class="q-my-xs"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ContentCard from 'components/ContentCard.vue'
import { useGeneralStore } from 'stores/general-store'

const generalStore = useGeneralStore()

generalStore.getAccounts()

const spendingAccounts = computed(() => {
  return generalStore.accounts.filter(account => account.kind === 'spending')
})

const savingAccounts = computed(() => {
  return generalStore.accounts.filter(account => account.kind === 'saving')
})
</script>

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}
</style>
