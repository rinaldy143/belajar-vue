// src/store/todo.ts
import { ref, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'

type TodoItem = { id: number; text: string; done: boolean }

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])

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

  return { todos, addTodo, toggleTodo, removeTodo }
})
