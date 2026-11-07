<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import OrdinateurCard from '../components/OrdinateurCard.vue'
import { chargerOrdinateurs, sauvegarderOrdinateurs, type Ordinateur } from '../data/ordinateurs'

const router = useRouter()
const liste = ref<Ordinateur[]>(chargerOrdinateurs())
const recherche = ref('')
const tri = ref<'memoire-desc' | 'memoire-asc' | 'modele'>('memoire-desc')

watch(
  liste,
  (valeur) => {
    sauvegarderOrdinateurs(valeur)
  },
  { deep: true },
)

const ordinateursFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase()
  let result = liste.value.filter((ordinateur) => {
    if (!terme) {
      return true
    }

    return (
      ordinateur.modele.toLowerCase().includes(terme) ||
      ordinateur.processeur.toLowerCase().includes(terme)
    )
  })

  if (tri.value === 'memoire-desc') {
    result = [...result].sort((a, b) => b.memoire - a.memoire)
  } else if (tri.value === 'memoire-asc') {
    result = [...result].sort((a, b) => a.memoire - b.memoire)
  } else {
    result = [...result].sort((a, b) => a.modele.localeCompare(b.modele))
  }

  return result
})

function ouvrirFormulaireAjout() {
  router.push('/ordinateurs/ajouter')
}

function ouvrirFormulaireModification(id: number) {
  router.push(`/ordinateurs/modifier/${id}`)
}

function supprimerOrdinateur(id: number) {
  const ordinateur = liste.value.find((item) => item.id === id)
  if (!ordinateur) {
    return
  }

  const confirmation = window.confirm(
    `Voulez-vous vraiment supprimer ${ordinateur.modele} du parc informatique ?`,
  )

  if (!confirmation) {
    return
  }

  liste.value = liste.value.filter((item) => item.id !== id)
}
</script>

<template>
  <main class="page-ordinateurs">
    <section class="toolbar">
      <div>
        <p class="eyebrow">Parc informatique</p>
        <h1>Ordinateurs</h1>
      </div>

      <button type="button" class="btn btn-primary" @click="ouvrirFormulaireAjout">
        + Ajouter un ordinateur
      </button>
    </section>

    <section class="filters">
      <label class="search-field">
        <span>Recherche</span>
        <input v-model="recherche" type="search" placeholder="Modèle ou processeur" />
      </label>

      <label class="sort-field">
        <span>Tri</span>
        <select v-model="tri">
          <option value="memoire-desc">Mémoire : décroissant</option>
          <option value="memoire-asc">Mémoire : croissant</option>
          <option value="modele">Modèle</option>
        </select>
      </label>
    </section>

    <p class="result-count">{{ ordinateursFiltres.length }} ordinateur(s) affiché(s)</p>

    <section v-if="ordinateursFiltres.length > 0" class="liste-cards">
      <OrdinateurCard
        v-for="ordinateur in ordinateursFiltres"
        :key="ordinateur.id"
        :ordinateur="ordinateur"
        @modifier="ouvrirFormulaireModification"
        @supprimer="supprimerOrdinateur"
      />
    </section>

    <section v-else class="empty-state">
      <p>Aucun ordinateur ne correspond à votre recherche.</p>
    </section>
  </main>
</template>

<style scoped>
.page-ordinateurs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #64879d;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 3vw, 3rem);
  color: #102c45;
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

.filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}

.search-field,
.sort-field {
  display: grid;
  gap: 8px;
  color: #2f465d;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #c9d7e2;
  border-radius: 12px;
  background: white;
  color: #163453;
  font: inherit;
}

.result-count {
  margin: 0 0 22px;
  color: #4a5d72;
  font-weight: 600;
}

.liste-cards {
  display: grid;
  gap: 22px;
}

.empty-state {
  padding: 40px 20px;
  border: 1px dashed #bfd0dd;
  border-radius: 18px;
  background: #f6fbff;
  text-align: center;
  color: #4b5f72;
  font-weight: 600;
}

@media (max-width: 700px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
