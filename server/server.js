const express = require('express');
const cors=require("cors");
require('dotenv').config();
const { Pool } = require('pg');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const todoRoutes = require('./routes/todos');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/todos', todoRoutes);

const {PGHOST,PGDATABASE,PGUSER,PGPASSWORD}=process.env;
const pool=new Pool({
    host:PGHOST,
    database:PGDATABASE,
    username:PGUSER,
    password: PGPASSWORD,
    port:5432,
    ssl:{
        require:true,
    }
})

// Cron job - runs every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily reset...');
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Get all users
        const users = await client.query('SELECT id FROM users');

        for (const user of users.rows) {
            const userId = user.id;

            // Check if yesterday's entry exists
            const yesterdayStats = await client.query(
                'SELECT * FROM daily_stats WHERE user_id = $1 AND date = $2',
                [userId, yesterdayStr]
            );

            let newStreak = 0;
            if (yesterdayStats.rows.length > 0 && yesterdayStats.rows[0].completed_all) {
                // Continue streak from yesterday
                newStreak = yesterdayStats.rows[0].streak_count;
            }
            // If yesterday wasn't completed or doesn't exist, streak resets to 0

            // Create today's entry
            await client.query(
                'INSERT INTO daily_stats (user_id, date, completed_all, streak_count) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, date) DO NOTHING',
                [userId, today, false, newStreak]
            );
        }

        await client.query('COMMIT');
        console.log('Daily reset completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in daily reset:', error);
    } finally {
        client.release();
    }
});

// Basic route
app.get('/', async(req, res) => {
    const client=await pool.connect();
    try{
        const result=await client.query("SELECT * FROM users");
        res.json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Database error' });
    }finally{
        client.release();
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Daily reset cron job scheduled for midnight');
});
