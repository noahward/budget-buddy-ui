<template>
  <q-layout
    view="lHh Lpr lFf"
    class="row justify-center"
  >
    <NavBar />
    <q-page-container class="container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from 'components/NavBar.vue'
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: 960px;
}
</style>
