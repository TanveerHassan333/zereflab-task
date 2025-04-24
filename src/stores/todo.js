import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: JSON.parse(localStorage.getItem('todos')) || []
  }),
  actions: {
    addTodo(text) {
      this.todos.push({ id: Date.now(), text, completed: false })
      this.saveToStorage()
    },
    updateTodo(id, newText) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.text = newText
        this.saveToStorage()
      }
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveToStorage()
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id)
      this.saveToStorage()
    },
    saveToStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    }
  }
})
