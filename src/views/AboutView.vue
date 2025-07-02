<template>
  <div class="about">
    <h1 class="italic">This is an about page</h1>
    <br />
    <h2 class="text-2xl mb-2">Counter: {{ counter.count }}</h2>
    <button
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      @click="counter.increment"
    >
      Tambah
    </button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>
