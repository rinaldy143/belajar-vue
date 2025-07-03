// src/store/todo.ts
import { ref, watch, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'

type TodoItem = { id: number; text: string; done: boolean }

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const filter = ref<'all' | 'done' | 'pending'>('all')
  const search = ref('')

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

    return result
  })

  function addTodo(text: string) {
    if (text.trim() === '') return
    todos.value.push({ id: Date.now(), text, done: false })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((t) => t.id !== id)
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

  return { todos, filter, search, filteredTodos, addTodo, toggleTodo, removeTodo }
})
