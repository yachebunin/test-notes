<template>
  <div class="note-item">
    <h2>{{ note.title }}</h2>
    <ul>
      <li v-for="(todo, i) in note.todos.slice(0, 3)" :key="todo.id">
        - {{ todo.text }}
        <span v-if="todo.done">(выполнено)</span>
      </li>
      <li v-if="note.todos.length > 3">
        ...ещё {{ note.todos.length - 3 }} пункт(ов)
      </li>
    </ul>
    <div class="actions">
      <button @click="editNote(note.id)">Редактировать</button>
      <button @click="confirmRemoveNote(note.id)">Удалить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { Note, useNotesStore } from '~/stores/notes'

const props = defineProps<{
  note: Note
}>()

const router = useRouter()
const notesStore = useNotesStore()

function editNote(id: number) {
  router.push(`/notes/${id}`)
}

function confirmRemoveNote(id: number) {
  if (confirm('Уверены, что хотите удалить заметку?')) {
    notesStore.removeNote(id)
  }
}
</script>

<style scoped>
.note-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
}

.note-item h2 {
  margin: 0 0 8px;
  font-weight: 600;
}

.note-item ul {
  margin: 0;
  padding-left: 16px;
}

.actions {
  margin-top: 12px;
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
