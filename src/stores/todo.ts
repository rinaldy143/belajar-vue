// src/store/todo.ts
import { ref, watch, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'

type TodoItem = {
  id: number
  text: string
  done: boolean
  dueDate: string | null
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const filter = ref<'all' | 'done' | 'pending'>('all')
  const search = ref('')
  const totalCount = computed(() => todos.value.length)
  const doneCount = computed(() => todos.value.filter((t) => t.done).length)
  const pendingCount = computed(() => todos.value.filter((t) => !t.done).length)

  const filteredTodos = computed(() => {
    let result = todos.value

    if (filter.value === 'done') {
      result = result.filter((t) => t.done)
    } else if (filter.value === 'pending') {
      result = result.filter((t) => !t.done)
    }

    if (search.value.trim() !== '') {
      result = result.filter((t) => t.text.toLowerCase().includes(search.value.toLowerCase()))
    }

    return result.sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  })

  function reset() {
    todos.value = []
    filter.value = 'all'
  }

  function addTodo(text: string, dueDate: string | null = null) {
    if (text.trim() === '') return
    todos.value.push({
      id: Date.now(),
      text,
      done: false,
      dueDate,
    })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function markAllDone() {
    todos.value.forEach((todo) => {
      todo.done = true
    })
  }

  function clearDone() {
    todos.value = todos.value.filter((todo) => !todo.done)
  }

  // 🧠 Load todo dari localStorage saat pertama kali dipakai
  onMounted(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      todos.value = JSON.parse(saved)
    }
  })

  // 💾 Simpan otomatis setiap kali todos berubah
  watch(
    todos,
    (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos))
    },
    { deep: true },
  )

  return {
    todos,
    filter,
    search,
    filteredTodos,
    clearDone,
    markAllDone,
    addTodo,
    toggleTodo,
    removeTodo,
    totalCount,
    doneCount,
    pendingCount,
    reset,
  }
})
