import { defineStore } from 'pinia'

export interface Todo {
  id: number
  text: string
  done: boolean
}

export interface Note {
  id: number
  title: string
  todos: Todo[]
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
  }),
  actions: {
    addNote(title: string) {
      const newNote: Note = {
        id: Date.now(),
        title,
        todos: [],
      }
      this.notes.push(newNote)
      return newNote.id
    },
    updateNote(noteId: number, updatedData: Partial<Note>) {
      const idx = this.notes.findIndex(n => n.id === noteId)
      if (idx !== -1) {
        this.notes[idx] = { ...this.notes[idx], ...updatedData }
      }
    },
    removeNote(noteId: number) {
      this.notes = this.notes.filter(n => n.id !== noteId)
    },
    addTodo(noteId: number, text: string, id?: number, done?: boolean) {
      const note = this.notes.find(n => n.id === noteId)
      if (note) {
        note.todos.push({
          id: id || Date.now(),
          text,
          done: done || false,
        })
      }
    },
    removeTodo(noteId: number, todoId: number) {
      const note = this.notes.find(n => n.id === noteId)
      if (note) {
        note.todos = note.todos.filter(t => t.id !== todoId)
      }
    },
    updateTodo(noteId: number, todoId: number, updatedData: Partial<Todo>) {
      const note = this.notes.find(n => n.id === noteId)
      if (note) {
        const idx = note.todos.findIndex(t => t.id === todoId)
        if (idx !== -1) {
          note.todos[idx] = { ...note.todos[idx], ...updatedData }
        }
      }
    },
    toggleTodo(noteId: number, todoId: number) {
      const note = this.notes.find(n => n.id === noteId)
      if (note) {
        const idx = note.todos.findIndex(t => t.id === todoId)
        if (idx !== -1) {
          note.todos[idx].done = !note.todos[idx].done
        }
      }
    },
  },
  persist: {
    storage: localStorage,
  },
})
