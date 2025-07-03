<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-black">📝 Todo List</h2>

    <!-- Input Pencarian -->
    <div class="mb-4">
      <input
        v-model="todos.search"
        type="text"
        placeholder="Cari todo..."
        class="w-full border px-3 py-2 rounded text-black"
      />
    </div>

    <!-- Input Tambah -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="newTodo"
        class="flex-1 border rounded px-3 py-2 text-black"
        placeholder="Apa yang ingin kamu kerjakan?"
        @keyup.enter="addTodo"
      />
      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="addTodo">Tambah</button>
    </div>

    <!-- Filter -->
    <div class="flex justify-center gap-2 mb-4">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        :class="[
          'px-3 py-1 rounded',
          todos.filter === option.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black',
        ]"
        @click="todos.filter = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Daftar Todo -->
    <ul>
      <li
        v-for="todo in todos.filteredTodos"
        :key="todo.id"
        class="flex items-center justify-between py-2 border-b text-black"
      >
        <!-- Tampilkan input jika sedang diedit -->
        <div class="flex-1">
          <input
            v-if="editingId === todo.id"
            v-model="editText"
            class="border px-2 py-1 rounded w-full text-black"
            @keyup.enter="saveEdit(todo.id)"
            @blur="saveEdit(todo.id)"
            autofocus
          />
          <div
            v-else
            @click="todos.toggleTodo(todo.id)"
            :class="{
              'line-through text-gray-400': todo.done,
              'cursor-pointer': true,
            }"
          >
            {{ todo.text }}
          </div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex items-center gap-2 ml-2">
          <button v-if="editingId !== todo.id" class="text-blue-500" @click="startEdit(todo)">
            ✏️
          </button>
          <button class="text-red-500" @click="todos.removeTodo(todo.id)">✖</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useTodoEdit } from '@/composables/useTodoEdit'

const newTodo = ref('')
const todos = useTodoStore()

type FilterType = 'all' | 'done' | 'pending'

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Selesai', value: 'done' },
  { label: 'Belum', value: 'pending' },
]

function addTodo() {
  todos.addTodo(newTodo.value)
  newTodo.value = ''
}

const { editingId, editText, startEdit, saveEdit } = useTodoEdit()
</script>
