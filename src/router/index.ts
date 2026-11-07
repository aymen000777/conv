import { createRouter, createWebHistory } from 'vue-router'
import EditOrdinateur from '../views/EditOrdinateur.vue'
import ListeOrdinateurs from '../views/ListeOrdinateurs.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/ordinateurs' },
    { path: '/ordinateurs', name: 'ordinateurs', component: ListeOrdinateurs },
    { path: '/ordinateurs/ajouter', name: 'ajouter-ordinateur', component: EditOrdinateur },
    {
      path: '/ordinateurs/modifier/:id',
      name: 'modifier-ordinateur',
      component: EditOrdinateur,
      props: true,
    },
  ],
})

export default router
