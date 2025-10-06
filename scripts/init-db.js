#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script runs after npm install to set up the database schema
 * It only runs if DATABASE_URL or DB_HOST is set
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');


const shouldInitialize = process.env.DATABASE_URL || process.env.DB_HOST;

if (!shouldInitialize) {
  console.log('📋 Skipping database initialization (no database connection configured)');
  process.exit(0);
}


const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ticketing_system',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
};

async function initializeDatabase() {
  const pool = new Pool(getDatabaseConfig());
  
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database successfully');
    

    const tablesExist = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user'
      );
    `);
    
    if (tablesExist.rows[0].exists) {
      console.log('✅ Database tables already exist - skipping initialization');
      await pool.end();
      return;
    }
    
    console.log('📋 Database is empty - running schema initialization...');
    
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.log('⚠️  schema.sql not found - skipping initialization');
      await pool.end();
      return;
    }
    
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schemaSql);
    
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.log('⚠️  Running on Railway - database may not be ready yet');
      console.log('   You can manually run the schema later using Railway\'s psql command');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
    console.log('🔴 Database connection closed');
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✨ Initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(0); // Exit with 0 to not fail the build
    });
}

module.exports = { initializeDatabase };

