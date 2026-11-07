# Gestion des ordinateurs

Application Vue.js 3 de gestion d’un parc informatique. Elle permet de consulter les ordinateurs, les ajouter, les modifier et les supprimer avec un stockage LocalStorage.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

## Construction

```bash
npm run build
```

## Fonctionnalités

- Liste des ordinateurs sous forme de cartes.
- Ajout et modification via la même vue de formulaire.
- Suppression avec confirmation `confirm()`.
- Validation des champs obligatoires et des valeurs strictement positives.
- Recherche par modèle ou processeur.
- Tri par mémoire ou alphabetique.
- Persistance des données dans `localStorage`.

## Routes

- `/ordinateurs` : liste des ordinateurs
- `/ordinateurs/ajouter` : ajout
- `/ordinateurs/modifier/:id` : modification
