<template>
  <div class="container">
    <h1>Список заметок</h1>
    <button @click="goToCreateNote">Создать новую заметку</button>
    <div class="notes-list">
      <NoteItem
        v-for="note in notesComputed"
        :key="note.id"
        :note="note"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '~/stores/notes'
import NoteItem from '~/components/NoteItem.vue'

const router = useRouter()
const notesStore = useNotesStore()

const notesComputed = computed(() => notesStore.notes)

function goToCreateNote() {
  router.push('/notes/new')
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

.notes-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

button {
  cursor: pointer;
  border: none;
  background: #4c87ed;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
}

button:hover {
  background: #2a66c3;
}
</style>
