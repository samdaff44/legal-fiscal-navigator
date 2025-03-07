
# Documentation de l'API LegalFiscal Navigator

## Introduction

Cette documentation décrit l'architecture et les interfaces de programmation de l'application LegalFiscal Navigator.

## Architecture MVC

L'application suit le modèle d'architecture MVC (Modèle-Vue-Contrôleur) :

- **Modèles** (`/src/models/`) : Définissent les structures de données et les fonctions d'accès aux données
- **Vues** (`/src/components/`) : Composants React pour l'affichage des données
- **Contrôleurs** (`/src/controllers/`) : Logique métier et opérations sur les données

## Modèles

### Database.ts

Gère les informations relatives aux bases de données et aux identifiants.

```typescript
interface DatabaseCredentials { 
  username: string;
  password: string;
  url: string;
}

interface CredentialsStore {
  database1: DatabaseCredentials; // Lexis Nexis
  database2: DatabaseCredentials; // Dalloz
  database3: DatabaseCredentials; // EFL Francis Lefebvre
}

function getStoredCredentials(): CredentialsStore | null
function getAccessibleDatabases(): string[]
function saveCredentials(credentials: CredentialsStore): void
```

### SearchResult.ts

Définit les structures pour les résultats de recherche et les options.

```typescript
interface SearchOptions {
  query: string;
  filters?: { ... }
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  source: 'Lexis Nexis' | 'Dalloz' | 'EFL Francis Lefebvre';
  type: 'jurisprudence' | 'doctrine' | 'legislation' | 'article';
  date: string;
  url: string;
  relevance: number;
  // ... autres propriétés
}

interface SearchHistory { ... }
interface DatabaseStatus { ... }
```

## Contrôleurs

### authController

Gère l'authentification et les identifiants des bases de données.

```typescript
function isAuthenticated(): boolean
function login(credentials: CredentialsStore): Promise<string[]>
function logout(): void
```

### searchController

Gère les opérations de recherche et de filtrage.

```typescript
function searchAllDatabases(options: SearchOptions): Promise<SearchResult[]>
function filterResults(results: SearchResult[], filters: any): SearchResult[]
function getSearchHistory(): SearchHistory[]
function addToSearchHistory(query: string, resultsCount: number): void
function clearSearchHistory(): void
```

## Hooks

### useSearchResults

Hook personnalisé pour gérer les résultats de recherche dans les composants.

```typescript
const { 
  results,
  isLoading,
  error,
  expandedResult,
  toggleExpand,
  handleCopy,
  searchedDatabases
} = useSearchResults({ query: string })
```

## Sécurité

L'application stocke les identifiants dans le localStorage du navigateur. En production, 
il faudrait envisager un système de chiffrement plus robuste ou une solution de stockage 
plus sécurisée, comme un backend avec sessions authentifiées.

## Tests

Les tests unitaires sont implémentés dans le dossier `/src/tests/`:

- `authController.test.ts` - Tests pour le contrôleur d'authentification
- `searchController.test.ts` - Tests pour le contrôleur de recherche

## Flux de données

1. L'utilisateur s'authentifie via le formulaire d'identifiants
2. Les identifiants sont validés et stockés par authController
3. L'utilisateur effectue une recherche qui est traitée par searchController
4. Les résultats sont affichés via le hook useSearchResults et les composants de vue

## Future amélioration

- Implémentation de l'API réelle pour les bases de données juridiques
- Sécurisation des identifiants avec chiffrement
- Système de cache plus avancé
- Pagination et filtrage avancé des résultats
