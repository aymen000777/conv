export type Ordinateur = {
  id: number
  modele: string
  processeur: string
  memoire: number
  disque: number
  carteGraphique: string
  photo: string
}

export const STORAGE_KEY = 'imc-vue-ordinateurs'

export const ordinateursSeed: Ordinateur[] = [
  {
    id: 1,
    modele: 'Dell XPS 15',
    processeur: 'Intel Core i7 12e génération',
    memoire: 16,
    disque: 512,
    carteGraphique: 'NVIDIA GeForce RTX 3050',
    photo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    modele: 'HP ProBook 450',
    processeur: 'AMD Ryzen 5 5600U',
    memoire: 32,
    disque: 1024,
    carteGraphique: 'AMD Radeon Graphics',
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    modele: 'Lenovo ThinkPad T14',
    processeur: 'Intel Core i5 11e génération',
    memoire: 8,
    disque: 256,
    carteGraphique: 'Intel Iris Xe',
    photo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    modele: 'MacBook Air M2',
    processeur: 'Apple M2',
    memoire: 16,
    disque: 512,
    carteGraphique: 'Apple M2 GPU',
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    modele: 'Asus ROG Strix G15',
    processeur: 'AMD Ryzen 7 6800H',
    memoire: 32,
    disque: 1000,
    carteGraphique: 'NVIDIA GeForce RTX 3070',
    photo: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
  },
]

export function chargerOrdinateurs(): Ordinateur[] {
  if (typeof localStorage === 'undefined') {
    return [...ordinateursSeed]
  }

  const donnees = localStorage.getItem(STORAGE_KEY)
  if (!donnees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordinateursSeed))
    return [...ordinateursSeed]
  }

  try {
    const stock = JSON.parse(donnees) as Ordinateur[]
    if (Array.isArray(stock) && stock.length > 0) {
      return stock
    }
  } catch {
    // Ignore invalid stored data and initialize with default values.
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ordinateursSeed))
  return [...ordinateursSeed]
}

export function sauvegarderOrdinateurs(ordinateurs: Ordinateur[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ordinateurs))
}
