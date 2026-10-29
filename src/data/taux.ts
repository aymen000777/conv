export const devises = ['USD', 'EUR', 'TND', 'GBP', 'JPY', 'CAD'] as const

export type Devise = (typeof devises)[number]

// Taux fixes exprimes pour un euro, fournis dans le sujet.
export const taux: Record<Devise, number> = {
  EUR: 1,
  USD: 1.17,
  TND: 3.4,
  GBP: 0.87,
  JPY: 172.5,
  CAD: 1.62,
}
