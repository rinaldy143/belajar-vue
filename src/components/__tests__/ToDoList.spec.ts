import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todo'

describe('Todo Store', () => {
  let todoStore: ReturnType<typeof useTodoStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    todoStore = useTodoStore()
    todoStore.reset()
  })

  it('should add todo', () => {
    todoStore.addTodo('Belajar testing')
    expect(todoStore.todos.length).toBe(1)
    expect(todoStore.todos[0].text).toBe('Belajar testing')
    expect(todoStore.todos[0].done).toBe(false)
  })

  it('should toggle todo done', () => {
    todoStore.addTodo('Belajar testing')
    const id = todoStore.todos[0].id
    todoStore.toggleTodo(id)
    expect(todoStore.todos[0].done).toBe(true)
  })

  it('should remove todo', () => {
    todoStore.addTodo('Belajar testing')
    const id = todoStore.todos[0].id
    todoStore.removeTodo(id)
    expect(todoStore.todos.length).toBe(0)
  })

  it('should mark all done', () => {
    todoStore.addTodo('Task 1')
    todoStore.addTodo('Task 2')
    todoStore.markAllDone()
    expect(todoStore.todos.every((t) => t.done)).toBe(true)
  })

  it('should clear done todos', () => {
    todoStore.addTodo('Task 1')
    todoStore.addTodo('Task 2')
    todoStore.markAllDone()
    todoStore.clearDone()
    expect(todoStore.todos.length).toBe(0)
  })
})
