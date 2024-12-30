<template>
  <div class="container" v-if="loaded">
    <h1>{{ isNew ? 'Создание заметки' : 'Редактирование заметки' }}</h1>
    <div class="form-field">
      <label>Заголовок</label>
      <input v-model="localNote.title" />
    </div>
    <h3>Список задач</h3>
    <div v-for="todo in localNote.todos" :key="todo.id" class="todo-item">
      <input type="checkbox" v-model="todo.done" @change="onChange" />
      <input type="text" v-model="todo.text" @input="onChange" />
      <button @click="removeTodo(todo.id)">Удалить</button>
    </div>
    <div class="add-todo">
      <input
        type="text"
        v-model="newTodoText"
        placeholder="Новый пункт..."
        @keyup.enter="addTodo"
      />
      <button @click="addTodo">Добавить пункт</button>
    </div>
    <div class="undo-redo">
      <button :disabled="historyIndex <= 0" @click="undoChange">Отменить</button>
      <button :disabled="historyIndex >= historyStack.length - 1" @click="redoChange">Повторить</button>
    </div>
    <div class="actions">
      <button @click="saveNote">Сохранить</button>
      <button @click="cancelEdit">Отменить</button>
      <button v-if="!isNew" @click="confirmRemoveNote">Удалить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Note, useNotesStore } from '~/stores/notes'

const props = defineProps<{
  noteId: string
  isNew: boolean
}>()

const router = useRouter()
const notesStore = useNotesStore()

const loaded = ref(false)
const localNote = ref<Note>({ id: 0, title: '', todos: [] })
let historyStack: Note[] = []
let historyIndex = ref(0)
const newTodoText = ref('')

onMounted(() => {
  if (props.isNew) {
    localNote.value = { id: 0, title: '', todos: [] }
    initHistory()
    loaded.value = true
  } else {
    const noteId = parseInt(props.noteId, 10)
    const noteFromStore = notesStore.notes.find(n => n.id === noteId)
    if (!noteFromStore) {
      alert('Заметка не найдена!')
      router.push('/')
      return
    }
    localNote.value = deepClone(noteFromStore)
    initHistory()
    loaded.value = true
  }
})

function initHistory() {
  historyStack = [deepClone(localNote.value)]
  historyIndex.value = 0
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function onChange() {
  historyStack = historyStack.slice(0, historyIndex.value + 1)
  historyStack.push(deepClone(localNote.value))
  historyIndex.value++
}

function undoChange() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    localNote.value = deepClone(historyStack[historyIndex.value])
  }
}

function redoChange() {
  if (historyIndex.value < historyStack.length - 1) {
    historyIndex.value++
    localNote.value = deepClone(historyStack[historyIndex.value])
  }
}

function addTodo() {
  if (!newTodoText.value.trim()) return
  localNote.value.todos.push({
    id: Date.now(),
    text: newTodoText.value.trim(),
    done: false,
  })
  newTodoText.value = ''
  onChange()
}

function removeTodo(todoId: number) {
  localNote.value.todos = localNote.value.todos.filter(t => t.id !== todoId)
  onChange()
}

function saveNote() {
  if (!localNote.value.title.trim()) {
    alert('Заголовок не может быть пустым')
    return
  }

  if (props.isNew) {
    const newId = notesStore.addNote(localNote.value.title)
    localNote.value.todos.forEach(todo => {
      notesStore.addTodo(newId, todo.text, todo.id, todo.done)
    })
    router.push('/')
  } else {
    notesStore.updateNote(localNote.value.id, {
      title: localNote.value.title
    })
    const noteInStore = notesStore.notes.find(n => n.id === localNote.value.id)
    if (!noteInStore) {
      router.push('/')
      return
    }
    localNote.value.todos.forEach(todo => {
      const existingTodo = noteInStore.todos.find(t => t.id === todo.id)
      if (!existingTodo) {
        notesStore.addTodo(localNote.value.id, todo.text, todo.id, todo.done)
      } else {
        notesStore.updateTodo(localNote.value.id, todo.id, {
          text: todo.text
        })
        if (existingTodo.done !== todo.done) {
          notesStore.toggleTodo(localNote.value.id, todo.id)
        }
      }
    })
    noteInStore.todos.forEach(t => {
      const existInLocal = localNote.value.todos.some(localT => localT.id === t.id)
      if (!existInLocal) {
        notesStore.removeTodo(localNote.value.id, t.id)
      }
    })
    router.push('/')
  }
}

function cancelEdit() {
  if (confirm('Уверены, что хотите отменить все изменения?')) {
    router.push('/')
  }
}

function confirmRemoveNote() {
  if (confirm('Точно удалить заметку?')) {
    notesStore.removeNote(localNote.value.id)
    router.push('/')
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.form-field {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-weight: 500;
}

.form-field input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.todo-item {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.add-todo {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.undo-redo {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

button {
  cursor: pointer;
  border: none;
  background: #4c87ed;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
}

button:hover {
  background: #2a66c3;
}
</style>
