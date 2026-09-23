# Vizualytic EMS

Vizualytic EMS is a lightweight employee management system built with Node.js and Express. It helps manage employee records, attendance, payroll, and recruitment workflows in a simple web-based interface.

## Features

- Employee management
- Attendance tracking
- Payroll processing
- Recruitment management
- Simple web dashboard interface

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kundankumar3113/vizualytic-ems.git
cd vizualytic-ems
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your local environment file from the example:

```bash
copy .env.example .env
```

Then update the values in `.env` with your own configuration.

### 4. Run the application

```bash
npm start
```

For development mode:

```bash
npm run dev
```

## Environment Variables

The application uses the following variables in `.env`:

- `PORT`
- `DB_PATH`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Scripts

- `npm start` — start the server
- `npm run dev` — start the server with nodemon for live reload

## Project Structure

```text
vizualytic-ems/
├── public/
├── server/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```
