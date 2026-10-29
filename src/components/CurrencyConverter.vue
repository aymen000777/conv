<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { devises, taux, type Devise } from '../data/taux'

const touches = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '.']
const montant = ref('0')
const deviseSource = ref<Devise>('USD')
const deviseCible = ref<Devise>('EUR')
const messageErreur = ref('')

const resultat = computed(() => {
  const valeur = Number(montant.value)
  if (!Number.isFinite(valeur) || valeur <= 0) return ''

  const montantEnEuros = valeur / taux[deviseSource.value]
  return (montantEnEuros * taux[deviseCible.value]).toFixed(2)
})

watch([montant, deviseSource, deviseCible], () => {
  messageErreur.value = ''
})

function appuyer(touche: string) {
  if (touche === 'C') {
    montant.value = '0'
    messageErreur.value = ''
    return
  }

  if (montant.value.length >= 10) return
  if (touche === '.' && montant.value.includes('.')) return

  if (touche === '.') {
    montant.value = `${montant.value === '0' ? '0' : montant.value}.`
  } else {
    montant.value = montant.value === '0' ? touche : `${montant.value}${touche}`
  }
}

function convertir() {
  if (Number(montant.value) === 0) {
    messageErreur.value = 'Veuillez saisir un montant.'
    return
  }

  messageErreur.value = ''
}

function inverser() {
  const ancienneSource = deviseSource.value
  deviseSource.value = deviseCible.value
  deviseCible.value = ancienneSource
}

function gererClavier(event: KeyboardEvent) {
  if (event.target instanceof HTMLSelectElement) return

  if (/^[0-9]$/.test(event.key)) {
    appuyer(event.key)
  } else if (event.key === '.') {
    appuyer('.')
  } else if (event.key.toLowerCase() === 'c') {
    appuyer('C')
  } else if (event.key === 'Backspace') {
    montant.value = montant.value.length > 1 ? montant.value.slice(0, -1) : '0'
    messageErreur.value = ''
  } else if (event.key === 'Enter') {
    convertir()
  } else {
    return
  }

  event.preventDefault()
}

onMounted(() => window.addEventListener('keydown', gererClavier))
onUnmounted(() => window.removeEventListener('keydown', gererClavier))
</script>

<template>
  <section class="converter-card" aria-labelledby="converter-title">
    <div class="display-panel">
      <h1 id="converter-title">Currency Converter</h1>

      <div class="currency-line">
        <label class="sr-only" for="source-currency">Devise source</label>
        <select id="source-currency" v-model="deviseSource">
          <option v-for="devise in devises" :key="devise" :value="devise">{{ devise }}</option>
        </select>
        <output
          class="amount-display"
          aria-label="Montant à convertir"
          :style="{ '--digit-count': montant.length }"
        >{{ montant }}</output>
      </div>

      <button class="swap-button" type="button" aria-label="Inverser les devises" @click="inverser">
        ⇅
      </button>

      <div class="currency-line">
        <label class="sr-only" for="target-currency">Devise cible</label>
        <select id="target-currency" v-model="deviseCible">
          <option v-for="devise in devises" :key="devise" :value="devise">{{ devise }}</option>
        </select>
        <output
          class="amount-display"
          aria-label="Montant converti"
          aria-live="polite"
          :style="{ '--digit-count': (resultat || '—').length }"
        >
          {{ resultat || '—' }}
        </output>
      </div>

      <button class="convert-button" type="button" @click="convertir">CONVERTIR</button>
    </div>

    <div class="keypad-panel">
      <div class="keypad" aria-label="Clavier numérique">
        <button
          v-for="touche in touches"
          :key="touche"
          type="button"
          :class="{ 'key-clear': touche === 'C' }"
          :aria-label="touche === 'C' ? 'Effacer le montant' : touche"
          @click="appuyer(touche)"
        >
          {{ touche }}
        </button>
      </div>
      <p v-if="messageErreur" class="error-message" role="alert">{{ messageErreur }}</p>
    </div>
  </section>
</template>

<style scoped>
.converter-card {
  width: min(100%, 360px);
  overflow: hidden;
  border: 1px solid #d5dfe2;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 20px 55px rgb(23 75 91 / 12%);
}

.display-panel {
  display: grid;
  gap: 12px;
  padding: 22px 24px 23px;
  background: #2bb8e8;
  color: #fff;
}

h1 {
  margin: 0 0 8px;
  color: inherit;
  font-size: 19px;
  font-weight: 700;
  text-align: center;
}

.currency-line {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  align-items: end;
  gap: 14px;
}

select {
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid rgb(255 255 255 / 54%);
  border-radius: 8px;
  background: rgb(255 255 255 / 48%);
  color: #173c57;
  font-size: 14px;
  font-weight: 700;
}

.amount-display {
  min-width: 0;
  overflow: hidden;
  padding: 0 0 3px;
  border-bottom: 2px solid rgb(23 60 87 / 55%);
  color: #173c57;
  font-size: clamp(16px, calc(320px / var(--digit-count)), 32px);
  font-weight: 600;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swap-button {
  justify-self: start;
  min-width: 42px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #173c57;
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
}

.convert-button {
  justify-self: center;
  min-width: 145px;
  margin-top: 5px;
  padding: 11px 20px;
  border: 0;
  border-radius: 24px;
  background: #2979c8;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.convert-button:hover {
  background: #2167ad;
}

.keypad-panel {
  padding: 12px 25px 20px;
  background: #fff;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 52px;
  justify-items: center;
  align-items: center;
}

.keypad button {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: #1ba6c9;
  cursor: pointer;
  font-size: 32px;
  font-weight: 500;
}

.keypad button:hover {
  background: #eef9fc;
}

.keypad button.key-clear {
  color: #f0727a;
}

.error-message {
  margin: 5px 0 0;
  color: #b13d48;
  font-size: 13px;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@media (max-width: 400px) {
  .display-panel {
    padding-right: 18px;
    padding-left: 18px;
  }

  .keypad-panel {
    padding-right: 19px;
    padding-left: 19px;
  }
}
</style>
