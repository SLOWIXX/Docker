# Citations

Application web pour enregistrer des citations : un formulaire permet de saisir une citation et son auteur, et une liste affiche toutes les citations enregistrées. Les données sont stockées dans PostgreSQL.

Le projet est entièrement conteneurisé avec Docker Compose : un reverse proxy, un front, une API, une base de données et une interface d'administration de la base.

## Prérequis

- Docker et Docker Compose
- Les ports `80` et `8080` libres sur la machine

## Lancement

```bash
cp .env.example .env
docker compose up --build
```

| Service | Adresse |
|---|---|
| Site | http://localhost |
| Adminer | http://localhost:8080 |

Au premier lancement, le back peut redémarrer quelques fois, le temps que PostgreSQL soit prêt.

Pour arrêter :

```bash
docker compose down      # arrête les services, les données sont conservées
docker compose down -v   # arrête les services et supprime la base
```

## Architecture

```
navigateur ──:80───► nginx ──/───────► front   (page HTML/JS)
                       └────/api/───► back    (API Express) ──► db (PostgreSQL)

navigateur ──:8080─► adminer ─────────────────────────────────► db
```

| Service | Image | Rôle |
|---|---|---|
| `nginx` | `nginx:alpine` | Point d'entrée unique sur le port 80. Envoie `/api/` vers le back et le reste vers le front. |
| `front` | build `./front` | Front construit avec Vite, servi par Nginx. |
| `back` | build `./back` | API Node.js (Express) qui lit et ajoute les citations dans la base. |
| `db` | `postgres:17-alpine` | Base de données. Les données sont gardées dans le volume `db-data`. |
| `adminer` | `adminer:6` | Interface web pour consulter la base, accessible uniquement depuis la machine. |

Les services communiquent par le réseau créé par Docker Compose, en s'appelant par leur nom (`back`, `front`, `db`).

## API

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/citations` | Liste des citations, de la plus récente à la plus ancienne |
| `POST` | `/api/citations` | Ajoute une citation. Corps JSON : `{ "author": "...", "text": "..." }` |

## Adminer

Sur http://localhost:8080 :

| Champ | Valeur |
|---|---|
| Système | PostgreSQL |
| Serveur | `db` |
| Utilisateur | valeur de `POSTGRES_USER` dans `.env` |
| Mot de passe | valeur de `POSTGRES_PASSWORD` dans `.env` |
| Base de données | valeur de `POSTGRES_DB` dans `.env` |

La table `citations` contient les citations ajoutées depuis le site.

## Configuration

Les identifiants de la base sont lus dans le fichier `.env`, utilisé par les services `db` et `back` :

| Variable | Rôle |
|---|---|
| `POSTGRES_USER` | Utilisateur de la base |
| `POSTGRES_PASSWORD` | Mot de passe de la base |
| `POSTGRES_DB` | Nom de la base |

Le mot de passe est enregistré dans la base à son premier démarrage. Pour le changer ensuite, il faut supprimer la base avec `docker compose down -v`.

## Structure

```
.
├── back/                 API Node.js (Express)
├── front/                Front-end Vite
├── nginx/nginx.conf      Configuration du reverse proxy
├── docker-compose.yml
└── .env.example          Modèle du fichier .env
```
