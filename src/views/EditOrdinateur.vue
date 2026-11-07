<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chargerOrdinateurs, sauvegarderOrdinateurs, type Ordinateur } from '../data/ordinateurs'

const route = useRoute()
const router = useRouter()

const liste = chargerOrdinateurs()
const isEdition = computed(() => route.path.startsWith('/ordinateurs/modifier/'))
const ordinateurId = computed(() => Number(route.params.id))

const formulaire = reactive({
  modele: '',
  processeur: '',
  memoire: 8,
  disque: 256,
  carteGraphique: '',
  photo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
})

const erreurs = reactive<Record<string, string>>({})

function remplirFormulaire({
  modele,
  processeur,
  memoire,
  disque,
  carteGraphique,
  photo,
}: Ordinateur) {
  formulaire.modele = modele
  formulaire.processeur = processeur
  formulaire.memoire = memoire
  formulaire.disque = disque
  formulaire.carteGraphique = carteGraphique
  formulaire.photo = photo
}

function initialiserFormulaire() {
  Object.keys(erreurs).forEach((key) => {
    delete erreurs[key]
  })

  if (isEdition.value) {
    const ordinateur = liste.find((item) => item.id === ordinateurId.value)
    if (ordinateur) {
      remplirFormulaire(ordinateur)
      return
    }
  }

  formulaire.modele = ''
  formulaire.processeur = ''
  formulaire.memoire = 8
  formulaire.disque = 256
  formulaire.carteGraphique = ''
  formulaire.photo = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
}

watch(
  () => route.path,
  () => {
    initialiserFormulaire()
  },
  { immediate: true },
)

function valider() {
  const erreursTemp: Record<string, string> = {}

  if (!formulaire.modele.trim()) {
    erreursTemp.modele = 'Le modèle est obligatoire.'
  }

  if (!formulaire.processeur.trim()) {
    erreursTemp.processeur = 'Le processeur est obligatoire.'
  }

  if (!Number.isFinite(formulaire.memoire) || formulaire.memoire <= 0) {
    erreursTemp.memoire = 'La mémoire doit être strictement positive.'
  }

  if (!Number.isFinite(formulaire.disque) || formulaire.disque <= 0) {
    erreursTemp.disque = 'Le disque doit être strictement positif.'
  }

  Object.keys(erreurs).forEach((key) => {
    delete erreurs[key]
  })

  Object.assign(erreurs, erreursTemp)
  return Object.keys(erreursTemp).length === 0
}

function enregistrer() {
  if (!valider()) {
    return
  }

  const ordinateurCourant: Ordinateur = {
    id: isEdition.value ? ordinateurId.value : Date.now(),
    modele: formulaire.modele.trim(),
    processeur: formulaire.processeur.trim(),
    memoire: Number(formulaire.memoire),
    disque: Number(formulaire.disque),
    carteGraphique: formulaire.carteGraphique.trim(),
    photo: formulaire.photo.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  }

  if (isEdition.value) {
    const index = liste.findIndex((item) => item.id === ordinateurId.value)
    if (index >= 0) {
      liste.splice(index, 1, ordinateurCourant)
    }
  } else {
    liste.unshift(ordinateurCourant)
  }

  sauvegarderOrdinateurs(liste)
  router.push('/ordinateurs')
}

function annuler() {
  router.push('/ordinateurs')
}
</script>

<template>
  <main class="page-edition">
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">{{ isEdition ? 'Modification' : 'Ajout' }}</p>
          <h1>{{ isEdition ? 'Modifier l’ordinateur' : 'Ajouter un ordinateur' }}</h1>
        </div>
        <button type="button" class="btn btn-ghost" @click="annuler">Retour à la liste</button>
      </div>

      <div class="form-grid">
        <div class="image-preview">
          <img :src="formulaire.photo || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'" alt="Aperçu du matériel" />
        </div>

        <form class="formulaire" @submit.prevent="enregistrer">
          <label>
            <span>Modèle</span>
            <input v-model="formulaire.modele" type="text" placeholder="Ex. Dell Latitude 7410" />
            <small v-if="erreurs.modele">{{ erreurs.modele }}</small>
          </label>

          <label>
            <span>Processeur</span>
            <input v-model="formulaire.processeur" type="text" placeholder="Ex. Intel Core i7" />
            <small v-if="erreurs.processeur">{{ erreurs.processeur }}</small>
          </label>

          <div class="two-columns">
            <label>
              <span>Mémoire (Go)</span>
              <input v-model.number="formulaire.memoire" type="number" min="1" step="1" />
              <small v-if="erreurs.memoire">{{ erreurs.memoire }}</small>
            </label>

            <label>
              <span>Disque (Go)</span>
              <input v-model.number="formulaire.disque" type="number" min="1" step="1" />
              <small v-if="erreurs.disque">{{ erreurs.disque }}</small>
            </label>
          </div>

          <label>
            <span>Carte graphique</span>
            <input v-model="formulaire.carteGraphique" type="text" placeholder="Ex. NVIDIA GeForce RTX 3060" />
          </label>

          <label>
            <span>Photo (URL)</span>
            <input v-model="formulaire.photo" type="url" placeholder="https://..." />
          </label>

          <div class="actions">
            <button type="button" class="btn btn-secondary" @click="annuler">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-edition {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.panel {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #dfeaf1;
  box-shadow: 0 18px 35px rgb(16 43 78 / 8%);
  padding: 28px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 26px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #64879d;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #10314f;
  font-size: clamp(2rem, 2.8vw, 2.8rem);
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(220px, 360px) minmax(0, 1fr);
  gap: 28px;
}

.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border-radius: 18px;
  background: linear-gradient(135deg, #edf7ff, #f9f6ff);
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  max-height: 420px;
  object-fit: cover;
}

.formulaire {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  color: #224561;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #c8d7e5;
  border-radius: 10px;
  background: white;
  color: #163453;
  font: inherit;
}

small {
  min-height: 1em;
  color: #c33b5d;
  font-weight: 700;
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

.btn {
  border: 0;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd, #1bb1d8);
  color: white;
}

.btn-secondary {
  background: #edf4fb;
  color: #214b6d;
}

.btn-ghost {
  background: transparent;
  color: #0a5d82;
  border: 1px solid #b9d7e7;
}

@media (max-width: 760px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column-reverse;
  }
}
</style>
