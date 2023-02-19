<template>
  <q-header class="bg-primary">
    <q-toolbar class="nav-container">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        size="20px"
        class="text-white"
        :class="{ 'hidden': $q.screen.gt.xs }"
        @click="toggleDrawer"
      />
      <div
        class="text-white text-h5"
        :class="$q.screen.lt.md ? 'text-weight-medium' : 'text-weight-bolder'"
      >
        Budget Buddy
      </div>
      <q-tabs
        no-caps
        :class="{ 'hidden': $q.screen.lt.sm }"
      >
        <q-route-tab
          v-for="link in linksList"
          :key="link"
          :to="link.link"
          :label="link.title"
          class="text-white"
        />
      </q-tabs>
      <q-btn flat round class="btn--no-hover">
        <q-avatar outlined>
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
      </q-btn>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="drawerOpen"
    bordered
  >
    <q-list class="q-mt-xl">
      <EssentialLink
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const drawerOpen = ref(false)
const linksList = [
  {
    title: 'Dashboard',
    caption: 'View your finances',
    icon: 'grid_view',
    link: '/dashboard'
  },
  {
    title: 'Accounts',
    caption: 'Manage your accounts',
    icon: 'account_balance',
    link: '/accounts'
  },
  {
    title: 'Goals',
    caption: 'Set and manage your savings goals',
    icon: 'outlined_flag',
    link: '/goals'
  },
  {
    title: 'Classify',
    caption: 'Categorize your transactions',
    icon: 'category',
    link: '/classify'
  },
  {
    title: 'Import',
    caption: 'Load in your account transactions',
    icon: 'file_upload',
    link: '/import'
  }
]
function toggleDrawer () {
  drawerOpen.value = !drawerOpen.value
}
</script>

<style scoped lang="scss">
.nav-container {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  padding: 0;

  @media (max-width: 990px) {
    padding: 0em 1em;
  }
}
:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}
</style>
