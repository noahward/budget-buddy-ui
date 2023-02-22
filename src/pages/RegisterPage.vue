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
          :validation-schema="userSchema"
          @submit="onSubmit"
        >
          <InputField
            name="email"
            kind="email"
            label="Email"
            :errors="registerErrors?.email"
          />
          <InputField
            name="firstName"
            kind="text"
            label="First Name"
            :errors="registerErrors?.firstName"
          />
          <InputField
            name="lastName"
            kind="text"
            label="Last Name"
            :errors="registerErrors?.lastName"
          />
          <InputField
            name="password"
            kind="password"
            label="Password"
            :errors="registerErrors?.nonFieldErrors"
          />
          <q-btn
            flat
            no-caps
            type="submit"
            class="bg-primary text-white full-width q-mb-md q-mt-lg"
            label="Register"
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
import { Form } from 'vee-validate'
import { useRouter } from 'vue-router'
import { object, string } from 'yup'
import { camelizeKeys, decamelizeKeys } from 'humps'
import { useAuthStore } from 'stores/auth-store'
import InputField from 'components/InputField.vue'

const router = useRouter()
const authStore = useAuthStore()

const userSchema = object({
  email: string().required('Email is required').email('Enter a valid email address'),
  firstName: string().required('First name is required'),
  lastName: string().required('First name is required'),
  password: string().required('Password is required').min(6, 'Password must be at least 6 characters')
})

interface RegisterErrors {
  email?: Array<string>;
  firstName?: Array<string>;
  lastName?: Array<string>; 
  nonFieldErrors?: Array<string>;
}
let registerErrors = ref<RegisterErrors>()

function onSubmit (values: object, actions: any) {
  authStore.register(decamelizeKeys(values))  
    .then((response) => {
      console.log(response)
      actions.resetForm()
      router.push('/')
    })
    .catch((error) => {
      registerErrors.value = camelizeKeys(error.response.data)
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
