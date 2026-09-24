const Database = require("better-sqlite3");
const path = require("path");

const database = new Database(path.join(__dirname, "ems.db"));

database.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    attendance_date TEXT NOT NULL,
    status TEXT NOT NULL,
    check_in TEXT,
    check_out TEXT
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    stage TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT
  ); 
`);
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const employeeColumns = [
  ["salary", "REAL"],
  ["date_of_joining", "TEXT"],
  ["phone", "TEXT"],
  ["address", "TEXT"],
];

for (const [column, type] of employeeColumns) {
  const existingColumn = database
    .prepare("PRAGMA table_info(employees)")
    .all()
    .some((item) => item.name === column);

  if (!existingColumn) {
    database.exec(`ALTER TABLE employees ADD COLUMN ${column} ${type}`);
  }
}

module.exports = database;
