<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-black">📝 Todo List</h2>

    <div class="flex gap-2 mb-4">
      <input
        v-model="newTodo"
        class="flex-1 border rounded px-3 py-2 text-black"
        placeholder="Apa yang ingin kamu kerjakan?"
        @keyup.enter="addTodo"
      />
      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="addTodo">Tambah</button>
    </div>

    <ul>
      <li
        v-for="todo in todos.todos"
        :key="todo.id"
        class="flex items-center justify-between py-2 border-b"
      >
        <div
          @click="todos.toggleTodo(todo.id)"
          :class="{
            'line-through text-gray-400': todo.done,
            'cursor-pointer': true,
            'text-black': !todo.done,
          }"
        >
          {{ todo.text }}
        </div>
        <button class="text-red-500" @click="todos.removeTodo(todo.id)">✖</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

const newTodo = ref('')
const todos = useTodoStore()

function addTodo() {
  todos.addTodo(newTodo.value)
  newTodo.value = ''
}
</script>
