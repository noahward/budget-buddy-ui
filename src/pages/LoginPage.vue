<template>
  <q-page class="column justify-center content-center">
    <q-card class="bg-grey-1 container">
      <q-card-section class="q-mt-sm">
        <div class="text-h6">
          Welcome Back
        </div>
        <div class="text-subtitle2 text-grey-2">
          Sign in to view your finances
        </div>
      </q-card-section>
      <q-card-section>
        <Form
          :validation-schema="userSchema"
          @submit="onSubmit"
        >
          <InputField
            name="email"
            kind="email"
            label="Email"
            :errors="loginErrors?.email"
          />
          <InputField
            name="password"
            kind="password"
            label="Password"
            :errors="loginErrors?.nonFieldErrors"
          />
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
      <span>New to Budget Buddy? </span>
      <a
        href="/register"
        class="text-blue-9"
      >Create an account</a>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import { object, string } from 'yup'
import { camelizeKeys } from 'humps'
import { useAuthStore } from 'stores/auth-store'
import InputField from 'components/InputField.vue'

const router = useRouter()
const authStore = useAuthStore()

const userSchema = object({
  email: string().required('Email is required').email('Enter a valid email address'),
  password: string().required('Password is required')
})

interface LoginErrors {
  email?: Array<string>;
  nonFieldErrors?: Array<string>;
}
let loginErrors = ref<LoginErrors>()

function onSubmit (values: object, actions: any) {
  authStore.login(values)
    .then((response) => {
      console.log(response)
      actions.resetForm()
      router.push('/')
    })
    .catch((error) => {
      loginErrors.value = camelizeKeys(error.response.data)
    })
}
</script>

<style lang="scss">
.container {
  max-width: 350px;
  width: 100%;
  text-align: center;
}
</style>
