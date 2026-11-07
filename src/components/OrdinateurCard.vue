<script setup lang="ts">
import type { Ordinateur } from '../data/ordinateurs'

const props = defineProps<{
  ordinateur: Ordinateur
}>()

const emit = defineEmits<{
  (event: 'modifier', id: number): void
  (event: 'supprimer', id: number): void
}>()

function formaterMemoire(memoire: number) {
  return `${memoire} Go`
}

function formaterDisque(disque: number) {
  return `${disque} Go`
}
</script>

<template>
  <article class="ordinateur-card">
    <img :src="props.ordinateur.photo" :alt="`Ordinateur ${props.ordinateur.modele}`" class="ordinateur-image" />

    <div class="ordinateur-content">
      <div class="ordinateur-header">
        <div>
          <p class="ordinateur-label">Modèle</p>
          <h3>{{ props.ordinateur.modele }}</h3>
        </div>
        <span class="ordinateur-memoire">{{ formaterMemoire(props.ordinateur.memoire) }}</span>
      </div>

      <ul class="ordinateur-specs">
        <li><strong>Processeur</strong> : {{ props.ordinateur.processeur }}</li>
        <li><strong>Stockage</strong> : {{ formaterDisque(props.ordinateur.disque) }}</li>
        <li><strong>Carte graphique</strong> : {{ props.ordinateur.carteGraphique }}</li>
      </ul>

      <div class="ordinateur-actions">
        <button type="button" class="btn btn-secondary" @click="emit('modifier', props.ordinateur.id)">
          Modifier
        </button>
        <button type="button" class="btn btn-danger" @click="emit('supprimer', props.ordinateur.id)">
          Supprimer
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.ordinateur-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 18px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #dfe7ee;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgb(20 52 81 / 8%);
}

.ordinateur-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  background: #edf4fa;
}

.ordinateur-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ordinateur-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.ordinateur-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6a7d8d;
  text-transform: uppercase;
}

.ordinateur-header h3 {
  margin: 8px 0 0;
  font-size: 1.6rem;
  color: #10314f;
}

.ordinateur-memoire {
  padding: 8px 12px;
  border-radius: 999px;
  background: #dff5ff;
  color: #0b5f79;
  font-weight: 700;
  white-space: nowrap;
}

.ordinateur-specs {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #34526d;
  line-height: 1.5;
}

.ordinateur-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
}

.btn {
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-secondary {
  background: #0e6e9a;
  color: white;
}

.btn-danger {
  background: #f4e4e6;
  color: #8e2d3d;
}

@media (max-width: 680px) {
  .ordinateur-card {
    grid-template-columns: 1fr;
  }

  .ordinateur-image {
    height: 220px;
  }
}
</style>
