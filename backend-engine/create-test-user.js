const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'testmanager123@gmail.com',
    password: 'password123',
    email_confirm: true
  });
  console.log('User creation result:', data, error);
}
main();
