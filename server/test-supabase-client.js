require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'NOT SET');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    try {
        console.log('\n1. Testing connection by selecting from users table...');
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(5);
        
        if (error) {
            console.error('❌ Error:', error);
        } else {
            console.log('✅ Success! Users:', data);
        }
        
        console.log('\n2. Testing insert (create user)...');
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ 
                name: 'Test User', 
                email: 'testclient@example.com', 
                password: 'hashedpass123' 
            }])
            .select()
            .single();
        
        if (insertError) {
            console.error('❌ Insert error:', insertError);
        } else {
            console.log('✅ User created:', newUser);
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testSupabase();
