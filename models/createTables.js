const db = require('../config/db');

const createUserTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created.');
  } catch (err) {
    console.error('❌ Error creating users table:', err.message);
  }
};

const createActivityTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        coach VARCHAR(100) NOT NULL,
        price NUMERIC(10,2) NOT NULL
      );
    `);
    console.log('✅ Activities table created.');
  } catch (err) {
    console.error('❌ Error creating activities table:', err.message);
  }
};

const createBookingTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending'
      );
    `);
    console.log('✅ Bookings table created.');
  } catch (err) {
    console.error('❌ Error creating bookings table:', err.message);
  }
};

const createUninterestedTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS uninterested_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Uninterested Activities table created.');
  } catch (err) {
    console.error('❌ Error creating uninterested_activities table:', err.message);
  }
};

const addRoleColumnToUsers = async () => {
  try {
    await db.none(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
    `);
    console.log('✅ Role column added to users table (if not exists).');
  } catch (err) {
    console.error('❌ Error adding role column to users table:', err.message);
  }
};

const createAllTables = async () => {
  await createUserTable();
  await createActivityTable();
  await createBookingTable();
  await createUninterestedTable();
  await addRoleColumnToUsers();
};

module.exports = createAllTables;