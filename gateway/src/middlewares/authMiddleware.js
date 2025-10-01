const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseURL = fs.existsSync(process.env.SUPABASE_URL_FILE) ? fs.readFileSync(process.env.SUPABASE_URL_FILE, 'utf-8').trim() : process.env.SUPABASE_URL;
const supabaseAnonKey = fs.existsSync(process.env.SUPABASE_ANON_KEY_FILE) ? fs.readFileSync(process.env.SUPABASE_ANON_KEY_FILE, 'utf-8').trim() : process.env.SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseURL,
  supabaseAnonKey
);

exports.authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer') ? auth.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: no bearer' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
    req.user = data.user;
    next();
  } catch (error) {
    console.error('❌ auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};