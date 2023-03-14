<template>
  <q-header :class="isAuthenticated ? 'bg-primary' : 'transparent'">
    <q-toolbar class="nav-container">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        size="20px"
        class="text-white"
        :class="{ 'hidden': $q.screen.gt.xs, 'invisible': !isAuthenticated }"
        @click="toggleDrawer"
      />
      <div
        class="text-h5"
        :class="isAuthenticated ? 'text-white' : 'text-primary'"
      >
        <span :class="$q.screen.lt.md ? 'text-weight-medium' : 'text-weight-bolder'">Budget</span>
        <span :class="$q.screen.lt.md ? 'text-weight-regular' : 'text-weight-medium'">Buddy</span>
      </div>
      <q-tabs
        no-caps
        :class="{ 'hidden': $q.screen.lt.sm, 'invisible': !isAuthenticated }"
      >
        <q-route-tab
          v-for="link in linksList"
          :key="link"
          :to="link.link"
          :label="link.title"
        />
      </q-tabs>
      <q-btn
        flat
        round
        class="btn--no-hover"
        :class="{ 'invisible': !isAuthenticated }"
        href="profile"
      >
        <q-avatar icon="account_circle" />
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
import { ref, computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'
import EssentialLink from 'components/EssentialLink.vue'

const authStore = useAuthStore()
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
  }
]

// TODO: Move this to the auth store for re-use in other components
const isAuthenticated = computed(() => {
  return Object.keys(authStore.user).length !== 0
})

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
