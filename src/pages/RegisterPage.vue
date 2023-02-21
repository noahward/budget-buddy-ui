<template>
  <q-page class="column justify-center content-center">
    <q-card class="bg-grey-1 container">
      <q-card-section class="q-mt-sm">
        <div class="text-h6">
          Create an account
        </div>
        <div class="text-subtitle2 text-grey-2">
          Track and analyze your finances, all in one place
        </div>
      </q-card-section>
      <q-card-section>
        <Form
          v-slot="{ errors }"
          :validation-schema="userSchema"
          @submit="onSubmit"
        >
          <Field
            v-slot="{ value, field }"
            name="email"
          >
            <q-input
              outlined
              dense
              label="Email"
              type="email"
              :model-value="value"
              v-bind="field"
              :class="{ 'q-mb-md': !errors.email }"
            />
          </Field>
          <div
            v-if="errors.email"
            class="text-red text-caption row justify-start q-mb-sm"
          >
            <q-icon
              name="error"
              class="q-mr-xs self-center"
            />
            <span class="self-center">{{ errors.email }}</span>
          </div>
          <Field
            v-slot="{ value, field }"
            name="password"
          >
            <q-input
              outlined
              dense
              label="Password"
              type="password"
              :model-value="value"
              v-bind="field"
            />
          </Field>
          <div
            v-if="errors.password"
            class="text-red text-caption row justify-start"
          >
            <q-icon
              name="error"
              class="q-mr-xs self-center"
            />
            <span class="self-center">{{ errors.password }}</span>
          </div>
          <div
            v-if="registerError"
            class="text-red text-caption row justify-start"
          >
            <q-icon
              name="error"
              class="q-mr-xs self-center"
            />
            <span class="self-center">{{ registerError }}</span>
          </div>
          <q-btn
            flat
            no-caps
            type="submit"
            class="bg-primary text-white full-width q-mb-md q-mt-lg"
            label="Sign In"
          />
        </Form>
      </q-card-section>
    </q-card>
    <div class="q-mt-sm">
      <span>Already have an account? </span>
      <a
        href="/login"
        class="text-blue-9"
      >Sign in</a>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { object, string } from 'yup'
import { Form, Field, configure } from 'vee-validate'
import { useAuthStore } from 'stores/auth-store'

const router = useRouter()
const authStore = useAuthStore()

const userSchema = object({
  email: string().required('Email is required').email('Enter a valid email address'),
  password: string().required('Password is required').min(6, 'Password must be at least 6 characters')
})

const registerError = ref()

function onSubmit (values: any, actions: any) {
  authStore.register(values)
    .then((response) => {
      console.log(response)
      actions.resetForm()
      router.push('/')
    })
    .catch((error) => {
      registerError.value = error
    })
}

configure({
  validateOnChange: false,
  validateOnModelUpdate: false
})
</script>

<style lang="scss">
.container {
  max-width: 350px;
  width: 100%;
  text-align: center;
}
</style>
