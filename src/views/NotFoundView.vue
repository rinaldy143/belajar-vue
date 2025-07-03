<template>
  <div class="min-h-[60vh] flex flex-col justify-center items-center text-center">
    <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
    <p class="text-xl mb-6 text-gray-600 dark:text-gray-300">Halaman tidak ditemukan</p>
    <RouterLink to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
      Kembali ke Beranda
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
