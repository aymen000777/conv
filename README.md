# Currency Converter

Convertisseur de devises réalisé avec Vue 3 et Vite. La page principale propose six devises, des taux fixes exprimés pour un euro, un clavier numérique et la conversion automatique du montant saisi.

## Installation et lancement

```sh
npm install
npm run dev
```

Pour vérifier les types et construire le projet :

```sh
npm run build
```

## Fonctionnalités

- Choisir une devise source et une devise cible parmi USD, EUR, TND, GBP, JPY et CAD.
- Convertir avec les taux fixes définis dans `src/data/taux.ts`.
- Saisir un montant avec le clavier de la page ou le clavier physique.
- Inverser les devises, effacer la saisie avec « C » et afficher le résultat arrondi à deux décimales.
- Afficher une erreur si le montant est nul, limiter la saisie à dix caractères et ignorer les points décimaux supplémentaires.
- Adapter la carte aux petits écrans.

Le résultat se met aussi à jour quand le montant ou l’une des devises change.
