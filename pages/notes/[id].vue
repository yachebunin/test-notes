<template>
  <NoteEditor :noteId="idParam" :isNew="isNew" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import NoteEditor from '~/components/NoteEditor.vue'

const route = useRoute()
const idParam = route.params.id as string
const isNew = idParam === 'new'
</script>
