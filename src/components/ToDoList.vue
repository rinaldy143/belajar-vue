<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-black">📝 Todo List</h2>
    <!-- Statistik -->
    <div class="flex flex-wrap gap-4 mb-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
      <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
        Total: {{ todos.totalCount }}
      </div>
      <div
        class="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 px-4 py-2 rounded"
      >
        Selesai: {{ todos.doneCount }}
      </div>
      <div
        class="bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded"
      >
        Belum: {{ todos.pendingCount }}
      </div>
    </div>

    <!-- Input Pencarian -->
    <div class="mb-4">
      <input
        v-model="todos.search"
        type="text"
        placeholder="Cari todo..."
        class="w-full border px-3 py-2 rounded text-black"
      />
    </div>

    <!-- Tombol Aksi Massal -->
    <div class="flex flex-wrap gap-2 mb-4 text-sm">
      <button
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        @click="todos.markAllDone"
      >
        ✅ Tandai Semua Selesai
      </button>

      <button
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        @click="todos.clearDone"
      >
        🗑️ Hapus Semua Selesai
      </button>
      <button
        class="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
        @click="exportTodos"
      >
        💾 Ekspor ke JSON
      </button>
      <label class="cursor-pointer bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded">
        📂 Impor JSON
        <input type="file" accept=".json" class="hidden" @change="importTodos" />
      </label>
    </div>

    <!-- Input Tambah -->
    <div class="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        v-model="newTodo"
        class="w-full sm:flex-1 border rounded px-3 py-2 text-black"
        placeholder="Apa yang ingin kamu kerjakan?"
        @keyup.enter="addTodoHandler"
      />
      <input
        v-model="newDueDate"
        type="date"
        class="border rounded px-3 py-2 w-full sm:w-auto text-black"
      />
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto transition duration-300 hover:scale-105 active:scale-95"
        @click="addTodoHandler"
      >
        Tambah
      </button>
      <!-- Tombol Impor -->
    </div>

    <!-- Filter -->
    <div class="flex flex-wrap justify-center gap-2 mb-4 text-sm sm:text-base">
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
    <ul class="space-y-2">
      <TransitionGroup name="fade" tag="ul" class="space-y-2">
        <li
          v-for="todo in todos.filteredTodos"
          :key="todo.id"
          class="flex items-start sm:items-center justify-between py-2 border-b gap-2 text-sm sm:text-base"
        >
          <!-- isi todo tetap -->
        </li>

        <li
          v-for="todo in todos.filteredTodos"
          :key="todo.id"
          class="flex items-start sm:items-center justify-between py-2 border-b gap-2 text-sm sm:text-base text-black"
        >
          <!-- Di dalam v-for="todo in todos.filteredTodos" -->
          <div>
            <div
              v-if="todo.dueDate"
              :class="[
                'text-xs',
                new Date(todo.dueDate) < new Date() && !todo.done
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-400',
              ]"
            >
              Deadline: {{ todo.dueDate }}
            </div>
          </div>

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
          <div class="flex items-center gap-2 shrink-0">
            <button v-if="editingId !== todo.id" class="text-blue-500" @click="startEdit(todo)">
              ✏️
            </button>
            <button class="text-red-500" @click="todos.removeTodo(todo.id)">✖</button>
          </div>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useTodoEdit } from '@/composables/useTodoEdit'

const newTodo = ref('')
const todos = useTodoStore()
const newDueDate = ref('')

type FilterType = 'all' | 'done' | 'pending'

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Selesai', value: 'done' },
  { label: 'Belum', value: 'pending' },
]

function addTodoHandler() {
  todos.addTodo(newTodo.value, newDueDate.value || null)
  newTodo.value = ''
  newDueDate.value = ''
}
function exportTodos() {
  const json = JSON.stringify(todos.todos, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'todos.json'
  link.click()

  URL.revokeObjectURL(url)
}

function importTodos(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const result = e.target?.result as string
      const imported = JSON.parse(result)

      // Validasi sederhana
      if (!Array.isArray(imported)) {
        alert('Format file tidak valid.')
        return
      }

      // Cek item
      const valid = imported.every(
        (item) =>
          typeof item.text === 'string' && typeof item.done === 'boolean' && 'dueDate' in item,
      )

      if (!valid) {
        alert('Isi data tidak sesuai.')
        return
      }

      // Tambah ke todo list
      for (const item of imported) {
        todos.todos.push({
          id: Date.now() + Math.random(), // pastikan id unik
          text: item.text,
          done: item.done,
          dueDate: item.dueDate || null,
        })
      }

      alert('Berhasil impor todo.')
    } catch (err) {
      alert('Gagal membaca file.')
    }
  }

  reader.readAsText(file)
}

const { editingId, editText, startEdit, saveEdit } = useTodoEdit()
</script>
