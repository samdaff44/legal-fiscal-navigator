
# Torbey Tax Navigator

## Description

Torbey Tax Navigator est une application de recherche juridique et fiscale permettant aux utilisateurs de consulter des bases de données spécialisées comme Lexis Nexis, Dalloz, et EFL Francis Lefebvre à partir d'une interface unique et simplifiée.

## Architecture

L'application est construite selon une architecture MVC (Modèle-Vue-Contrôleur) :

- **Modèles** (`/src/models/`) : Définissent les structures de données (SearchResult, Database)
- **Vues** (`/src/components/`) : Composants React pour l'interface utilisateur
- **Contrôleurs** (`/src/controllers/`) : Logique métier et opérations sur les données

## Fonctionnalités principales

- Authentification aux bases de données juridiques via identifiants
- Recherche unifiée sur plusieurs bases de données
- Historique des recherches
- Filtrage et tri des résultats
- Interface responsive et intuitive

## Structure du projet

```
src/
├── components/        # Composants UI
│   ├── search/        # Composants liés à la recherche
│   └── ui/            # Composants d'interface réutilisables
├── controllers/       # Contrôleurs pour la logique métier
│   └── search/        # Contrôleurs spécifiques à la recherche
├── hooks/             # Hooks React personnalisés
├── models/            # Modèles de données
├── pages/             # Pages complètes de l'application
└── services/          # Services externes (scraping, API)
```

## Flux de données

1. L'utilisateur s'authentifie via le formulaire d'identifiants
2. Les identifiants sont validés et stockés dans le localStorage
3. L'utilisateur effectue une recherche qui est traitée par le searchController
4. Le searchController effectue des requêtes aux différentes bases de données
5. Les résultats sont filtrés, triés et affichés à l'utilisateur

## Composants clés

### SearchBar

Le composant principal pour la recherche, permettant à l'utilisateur de :
- Saisir une requête de recherche
- Choisir les bases de données à interroger
- Accéder à l'historique des recherches récentes

### ResultsDisplay

Affiche les résultats de recherche avec :
- Onglets pour filtrer par source
- Liste des résultats avec possibilité d'expansion
- Options de copie et d'exportation

## Utilisation du localStorage

L'application utilise le localStorage pour :
- Stocker les identifiants des bases de données
- Conserver l'historique des recherches
- Sauvegarder les préférences utilisateur

## Sécurité

Les identifiants sont stockés localement dans le navigateur. Il a été implémenté :
- Un chiffrement des données sensibles
- Une authentification via un backend sécurisé
- Des sessions avec expiration automatique

## Technologies utilisées

- React avec React Router pour la navigation
- TypeScript pour la sécurité des types
- TailwindCSS pour le styling
- Tanstack Query pour la gestion des requêtes
- Shadcn/UI pour les composants d'interface
