require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        console.log('Host:', process.env.PGHOST);
        console.log('Database:', process.env.PGDATABASE);
        console.log('User:', process.env.PGUSER);
        console.log('Port:', 6543);
        
        // Test basic connection
        const result = await pool.query('SELECT NOW()');
        console.log('\n✅ Connection successful!');
        console.log('Current time from database:', result.rows[0].now);
        
        // Test if users table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);
        console.log('\n✅ Users table exists:', tableCheck.rows[0].exists);
        
        // Try to query users table
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        console.log('✅ Users count:', usersCount.rows[0].count);
        
        // List all tables
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log('\n📋 All tables in database:');
        tables.rows.forEach(row => console.log('  -', row.table_name));
        
        await pool.end();
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error detail:', error.detail);
        console.error('\nFull error:', error);
        await pool.end();
        process.exit(1);
    }
}

testConnection();
