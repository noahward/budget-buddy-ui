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
      <div
        v-if="isAuthenticated"
        class="text-h6 text-weight-medium self-center q-ml-md"
      >
        {{ authStore.user.profile.firstName }} {{ authStore.user.profile.lastName }}
      </div>
    </div>
    <q-card
      flat
      class="bg-grey-1 q-px-md q-py-sm q-mt-md"
    >
      <div class="row justify-between items-center q-my-md">
        <div>
          <div class="text-caption">
            Email
          </div>
          <div
            v-if="isAuthenticated"
            class="text-weight-bold"
          >
            {{ authStore.user.profile.email }}
          </div>
        </div>
        <q-btn
          flat
          round
          class="text-primary"
          @click="editDialog = true"
        >
          <q-icon
            name="edit"
            size="xs"
          />
        </q-btn>
      </div>
      <div class="row justify-between items-center q-my-md">
        <div>
          <div class="text-caption">
            Password
          </div>
          <q-icon
            v-for="i in 6"
            :key="i"
            name="fiber_manual_record"
            size="7px"
          />
        </div>
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

    <q-dialog
      v-model="editDialog"
      persistent
    >
      <q-card style="min-width: 350px">
        <Form
          :initial-values="authStore.user.profile"
          :validation-schema="userSchema"
          @submit="updateUserInfo"
        >
          <div class="text-h6 text-weight-bold q-mx-md q-mt-md">
            Update Profile
          </div>
          <q-card-section class="column">
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                Email
              </div>
              <InputField
                kind="email"
                name="email"
                :errors="updateErrors?.email"
              />
            </div>
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                First Name
              </div>
              <InputField
                kind="text"
                name="firstName"
                :errors="updateErrors?.firstName"
              />
            </div>
            <div class="column">
              <div class="text-caption1 text-weight-medium q-mb-xs">
                Last Name
              </div>
              <InputField
                kind="text"
                name="lastName"
                :errors="updateErrors?.lastName"
              />
            </div>
          </q-card-section>
          <q-card-actions
            align="right"
            class="text-primary"
          >
            <q-btn
              v-close-popup
              no-caps
              flat
              label="Cancel"
            />
            <q-btn
              no-caps
              flat
              label="Update"
              type="submit"
            />
          </q-card-actions>
        </Form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { useAuthStore } from 'stores/auth-store'
import { ref, computed } from 'vue'
import { ApiUserErrors } from '../models/user.model'
import { object, string } from 'yup'
import { camelizeKeys, decamelizeKeys } from 'humps'
import InputField from 'components/InputField.vue'

const editDialog = ref(false)

const userSchema = object({
  email: string().email('Enter a valid email address'),
  firstName: string(),
  lastName: string()
})

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return Object.keys(authStore.user).length !== 0
})

const updateErrors = ref<ApiUserErrors>()

function updateUserInfo (values: object, actions: any) {
  authStore.updateUser(decamelizeKeys(values))
    .then(() => {
      actions.resetForm()
      editDialog.value = false
    })
    .catch((error) => {
      updateErrors.value = camelizeKeys(error.response.data)
    })
}

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
