<template>
  <q-page class="column">
    <div class="text-h6 text-weight-bold q-my-md">
      My Account
    </div>
    <div class="row q-my-sm">
      <q-btn
        flat
        rounded
        :ripple="false"
        class="btn--no-hover padding-none"
      >
        <q-avatar size="50px">
          <img src="https://cdn.quasar.dev/img/avatar.png">
          <q-badge
            floating
            rounded
            class="bg-grey-2"
          >
            <q-icon
              size="15px"
              name="edit"
            />
          </q-badge>
        </q-avatar>
      </q-btn>
      <div class="text-h6 text-weight-medium self-center q-ml-md" v-if="isAuthenticated">
        {{ authStore.user.user.first_name }} {{ authStore.user.user.last_name }}
      </div>
    </div>
    <q-card
      flat
      class="bg-grey-1 q-px-md q-py-sm q-mt-md"
    >
      <div class="row justify-between items-center q-my-md">
        <div>
          <div class="text-caption">
            Display Name
          </div>
          <div class="text-weight-bold" v-if="isAuthenticated">
            {{ authStore.user.user.first_name }} {{ authStore.user.user.last_name }}
          </div>
        </div>
        <q-btn
          dense
          flat
          no-caps
          class="text-white bg-primary"
        >
          <span class="q-mx-sm">Edit</span>
        </q-btn>
      </div>
      <div class="row justify-between items-center q-my-md">
        <div>
          <div class="text-caption">
            Email
          </div>
          <div class="text-weight-bold" v-if="isAuthenticated">
            {{ authStore.user.user.email }}
          </div>
        </div>
        <q-btn
          dense
          flat
          no-caps
          class="text-white bg-primary"
        >
          <span class="q-mx-sm">Edit</span>
        </q-btn>
      </div>
      <div class="row justify-between items-center q-my-md">
        <div>
          <div class="text-caption">
            Password
          </div>
          <div class="text-weight-bold">
            ∙∙∙∙∙∙∙∙
          </div>
        </div>
        <q-btn
          dense
          flat
          no-caps
          class="text-white bg-primary"
        >
          <span class="q-mx-sm">Change</span>
        </q-btn>
      </div>
      <q-btn
        dense
        flat
        no-caps
        class="bg-negative text-white q-my-md"
        @click="logoutUser"
      >
        <span class="q-mx-sm">Sign out</span>
      </q-btn>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from 'stores/auth-store'

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return Object.keys(authStore.user).length !== 0
})

function logoutUser () {
  authStore.logout()
}
</script>

<style scoped lang="scss">
:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}

.padding-none {
  padding: 0;
}
</style>
