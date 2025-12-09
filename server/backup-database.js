require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

async function backupDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.sql`;
    
    try {
        const tables = ['users', 'habits', 'habit_logs', 'daily_stats', 'todos', 'journal_entries'];
        let backup = '';

        for (const table of tables) {
            const result = await pool.query(`SELECT * FROM ${table}`);
            backup += `\n-- Backup of ${table} table\n`;
            backup += `DELETE FROM ${table};\n`;
            
            if (result.rows.length > 0) {
                const columns = Object.keys(result.rows[0]).join(', ');
                for (const row of result.rows) {
                    const values = Object.values(row).map(v => 
                        v === null ? 'NULL' : 
                        typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : 
                        v instanceof Date ? `'${v.toISOString()}'` :
                        v
                    ).join(', ');
                    backup += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
                }
            }
        }

        fs.writeFileSync(backupFile, backup);
        console.log(`✅ Backup saved to ${backupFile}`);
        console.log(`📊 Total size: ${(backup.length / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await pool.end();
    }
}

backupDatabase();
