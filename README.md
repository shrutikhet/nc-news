# NC News Seeding

```bash
npm install
```

## Create .env files at the main folder for development and test environement.

- .env.developement - Add the name of the database

  PGDATABASE=nc_news

- .env.test - Add the name of the database

  PGDATABASE=nc_news_test

- .env.production - Add the name of the database

  DATABASE_URL
  PGDATABASE=nc_news

## Setup

  Initialise database with npm run setup-dbs

  Seed database with npm run seed-dev

  Run using npm start

## Hosted URL

  https://nc-news-sh-14thmarch.onrender.com/api

  The project is like Reddit. It has articles, comments, topics, users.

  The minimum version of postgres and node.js needed are.

  Clear instructions of how to clone, install dependencies, seed local database, and run tests.
