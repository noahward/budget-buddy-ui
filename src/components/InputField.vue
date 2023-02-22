<template>
  <div :class="errorMessage ? 'q-mb-sm' : 'q-mb-md'">
    <q-input
      v-model="value"
      outlined
      dense
      :label="label"
      :type="kind"
      v-on="validationListeners"
    />
    <div
      v-if="errorMessage || errors"
      class="text-red text-caption row justify-start"
    >
      <q-icon
        name="error"
        class="q-mr-xs self-center"
      />
      <span class="self-center">{{ errorMessage }}</span>
      <span v-for="err in errors" :key="err" class="self-center">{{ err }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { toRef, computed } from 'vue'

interface PropTypes {
  name: string;
  kind: 'email' | 'password' | 'text';
  label: string;
  errors?: Array<string>;
}
const props = defineProps<PropTypes>()

const { errorMessage, value, handleChange } = 
useField<string>(
  toRef(props, 'name'),
  undefined,
  { validateOnValueUpdate: false }
)

const validationListeners = computed(() => {
  // Lazy
  if (!errorMessage.value) {
    return {
      blur: handleChange,
      change: handleChange,
      input: (e: Event) => handleChange(e, false)
    }
  }
  // Aggressive
  return {
    blur: handleChange,
    change: handleChange,
    input: handleChange
  }
})
</script>
