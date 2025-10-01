const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');

const supabaseURL = fs.existsSync(process.env.SUPABASE_URL_FILE) ? fs.readFileSync(process.env.SUPABASE_URL_FILE, 'utf-8').trim() : process.env.SUPABASE_URL;
const supabaseRoleKey = fs.existsSync(process.env.SUPABASE_ROLE_KEY_FILE) ? fs.readFileSync(process.env.SUPABASE_ROLE_KEY_FILE) : process.env.SUPABASE_ROLE_KEY;

const supabase = createClient(
  supabaseURL,
  supabaseRoleKey,
  { auth: { persistSession: false } }
);

module.exports = supabase;