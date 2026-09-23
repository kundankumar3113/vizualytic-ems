# Vizualytic EMS

A simple employee management system built with Node.js and Express.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
4. Update the values in `.env` with your real configuration.
5. Start the app:
   ```bash
   npm start
   ```

## Environment variables

The project expects the following variables in `.env`:

- `PORT`
- `DB_PATH`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Scripts

- `npm start` - run the server
- `npm run dev` - run with nodemon
