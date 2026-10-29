<script setup lang="ts">
import { computed, ref } from 'vue'

type Question = {
  texte: string
  image: string
  choix: string[]
  bonneReponse: number
  descriptionImage: string
}

const questions: Question[] = [
  {
    texte: 'Combien de côtés cette forme possède-t-elle ?',
    image: '/images/triangle.svg',
    choix: ['3 côtés', '4 côtés', '5 côtés'],
    bonneReponse: 0,
    descriptionImage: 'Un triangle bleu posé sur un fond clair.',
  },
  {
    texte: 'Quelle forme a quatre côtés de même longueur et quatre angles droits ?',
    image: '/images/carre.svg',
    choix: ['Un rectangle', 'Un carré', 'Un losange'],
    bonneReponse: 1,
    descriptionImage: 'Un carré orange, dessiné bien droit.',
  },
  {
    texte: 'Quel est le nom de cette figure plane parfaitement ronde ?',
    image: '/images/cercle.svg',
    choix: ['Un ovale', 'Un cercle', 'Une sphère'],
    bonneReponse: 1,
    descriptionImage: 'Un cercle violet sans côtés ni sommets.',
  },
  {
    texte: 'Combien de branches compte cette étoile ?',
    image: '/images/etoile.svg',
    choix: ['4 branches', '5 branches', '6 branches'],
    bonneReponse: 1,
    descriptionImage: 'Une étoile jaune à cinq branches.',
  },
  {
    texte: 'Quelle forme possède deux côtés longs et deux côtés courts ?',
    image: '/images/rectangle.svg',
    choix: ['Un carré', 'Un trapèze', 'Un rectangle'],
    bonneReponse: 2,
    descriptionImage: 'Un rectangle vert, plus large que haut.',
  },
]

const indexQuestion = ref(0)
const score = ref(0)
const reponseChoisie = ref<number | null>(null)
const termine = ref(false)

const questionCourante = computed(() => {
  const question = questions[indexQuestion.value]
  if (!question) throw new RangeError(`Question index ${indexQuestion.value} is out of range`)
  return question
})
const nombreReponses = computed(
  () => indexQuestion.value + (reponseChoisie.value === null ? 0 : 1),
)
const derniereQuestion = computed(() => indexQuestion.value === questions.length - 1)
const reponseCorrecte = computed(
  () => reponseChoisie.value === questionCourante.value.bonneReponse,
)

function repondre(indexChoix: number) {
  if (termine.value || reponseChoisie.value !== null) return

  reponseChoisie.value = indexChoix
  if (indexChoix === questionCourante.value.bonneReponse) {
    score.value += 1
  }
}

function avancer() {
  if (reponseChoisie.value === null || termine.value) return
  if (derniereQuestion.value) {
    termine.value = true
    return
  }

  indexQuestion.value += 1
  reponseChoisie.value = null
}

function rejouer() {
  indexQuestion.value = 0
  score.value = 0
  reponseChoisie.value = null
  termine.value = false
}
</script>

<template>
  <div class="quiz-shell">
    <header class="quiz-topbar">
      <a class="quiz-brand" href="/" aria-label="Retour au convertisseur de devises">Formes en tête<span>.</span></a>
      <div class="quiz-top-actions">
        <a class="converter-link" href="/">Convertisseur de devises</a>
        <div class="quiz-score" :aria-label="`Score : ${score} sur ${questions.length}`">
          SCORE <strong>{{ score }}<span> / {{ questions.length }}</span></strong>
        </div>
      </div>
    </header>

    <main class="quiz-page">
      <section class="quiz-intro">
        <p class="quiz-eyebrow">LE PETIT QUIZ DES FORMES</p>
        <h1>Ouvre l’œil,<br /><em>trouve la forme.</em></h1>
        <p>Cinq images, cinq questions. Observe bien chaque forme et choisis la bonne réponse.</p>
      </section>

      <section v-if="!termine" class="quiz-card" aria-label="Quiz en images">
        <div class="quiz-progress-header">
          <span>TA PROGRESSION</span>
          <strong>{{ nombreReponses }} / {{ questions.length }}</strong>
        </div>
        <progress
          class="quiz-progress"
          :value="nombreReponses"
          :max="questions.length"
          :aria-label="`Progression : ${nombreReponses} réponses sur ${questions.length}`"
        ></progress>

        <div class="quiz-question-layout">
          <div class="quiz-image-frame">
            <span>À OBSERVER</span>
            <img :src="questionCourante.image" :alt="questionCourante.descriptionImage" />
          </div>

          <div class="quiz-question-content">
            <p class="quiz-question-number">QUESTION {{ indexQuestion + 1 }} <span>/ {{ questions.length }}</span></p>
            <h2>{{ questionCourante.texte }}</h2>
            <div class="quiz-choices" role="group" aria-label="Choisissez une réponse">
              <button
                v-for="(choix, index) in questionCourante.choix"
                :key="choix"
                class="quiz-choice"
                :class="{
                  'is-correct': reponseChoisie !== null && index === questionCourante.bonneReponse,
                  'is-incorrect': reponseChoisie === index && !reponseCorrecte,
                }"
                type="button"
                :disabled="reponseChoisie !== null"
                @click="repondre(index)"
              >
                <span class="quiz-choice-letter">{{ String.fromCharCode(65 + index) }}</span>
                <span>{{ choix }}</span>
                <span v-if="reponseChoisie !== null && index === questionCourante.bonneReponse" aria-hidden="true">✓</span>
                <span v-else-if="reponseChoisie === index" aria-hidden="true">×</span>
              </button>
            </div>

            <p v-if="reponseChoisie !== null" class="quiz-feedback" :class="{ 'is-right': reponseCorrecte }" role="status">
              <template v-if="reponseCorrecte">Bonne réponse ! Bien observé.</template>
              <template v-else>Pas tout à fait. La bonne réponse était « {{ questionCourante.choix[questionCourante.bonneReponse] }} ».</template>
            </p>
            <button v-if="reponseChoisie !== null" class="quiz-next" type="button" @click="avancer">
              {{ derniereQuestion ? 'Voir le résultat' : 'Question suivante' }} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section v-else class="quiz-result" aria-labelledby="quiz-result-title" aria-live="polite">
        <p class="quiz-eyebrow">QUIZ TERMINÉ</p>
        <h2 id="quiz-result-title">Bravo d’être allé<br /><em>jusqu’au bout !</em></h2>
        <p class="quiz-final-score">{{ score }}<span> / {{ questions.length }}</span></p>
        <p class="quiz-result-caption">
          {{ score === questions.length ? 'Un sans-faute, tu as l’œil !' : `Tu as trouvé ${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${questions.length}.` }}
        </p>
        <button class="quiz-next quiz-replay" type="button" @click="rejouer">Rejouer le quiz <span aria-hidden="true">↻</span></button>
      </section>

      <footer class="quiz-footer">
        <span>OBSERVE · RÉFLÉCHIS · RÉPONDS</span>
        <a href="/">Retour au convertisseur de devises</a>
      </footer>
    </main>
  </div>
</template>
