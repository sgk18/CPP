import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@gmail.com',
    password: '0123456789',
    email_confirm: true
  });

  if (error) {
    console.error("Error creating user:", error);
  } else {
    console.log("User created successfully:", data.user.email);
  }
}

main();
