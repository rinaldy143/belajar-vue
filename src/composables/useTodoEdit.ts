import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

export function useTodoEdit() {
  const todos = useTodoStore()
  const editingId = ref<number | null>(null)
  const editText = ref('')

  function startEdit(todo: { id: number; text: string }) {
    editingId.value = todo.id
    editText.value = todo.text
  }

  function saveEdit(id: number) {
    const target = todos.todos.find((t) => t.id === id)
    if (target && editText.value.trim() !== '') {
      target.text = editText.value.trim()
    }
    editingId.value = null
    editText.value = ''
  }

  return {
    editingId,
    editText,
    startEdit,
    saveEdit,
  }
}
