<template>
  <q-page>
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-5 column">
          <div class="column">
            <AccountDropdown @account-select="(id) => selectedAccountId=id" />
            <span class="text-grey-2 text-caption q-mt-xs">135 unclassified transactions for this account</span>
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
        <q-card-section>
          Temp
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AccountDropdown from 'components/AccountDropdown.vue'
import { ref } from 'vue'

const selectedAccountId = ref()
</script>

<style scoped lang="scss">
.container {
  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}
</style>
