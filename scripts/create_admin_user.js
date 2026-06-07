#!/usr/bin/env node
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Set them and re-run: npm run create-admin');
  process.exit(1);
}

const email = 'admin@gmail.com';
const password = '0123456789';

(async () => {
  try {
    const url = SUPABASE_URL.replace(/\/$/, '') + '/auth/v1/admin/users';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Supabase API error:', res.status, data);
      process.exit(1);
    }

    console.log('Admin user created or already exists:', data);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
})();
