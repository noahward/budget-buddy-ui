<template>
  <div
    class="bg-grey-1 q-pa-md rounded-borders row justify-between full-width"
  >
    <div class="column">
      <span class="text-subtitle1 text-weight-medium">{{ name }}</span>
      <span class="text-caption text-grey-2">{{ nickname }}</span>
    </div>
    <span
      class="text-weight-bold text-primary q-mt-sm"
      :class="$q.screen.lt.sm ? 'text-h6' : 'text-h5'"
    >${{ amount }}</span>
  </div>
</template>

<script setup lang="ts">
interface PropTypes {
  name: string;
  nickname?: string;
  amount: number;
}
withDefaults(defineProps<PropTypes>(), { amount: 0, nickname: '', name: '' })
</script>
