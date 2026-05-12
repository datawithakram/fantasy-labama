const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function syncUser() {
  const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
  if (fetchError) return console.error(fetchError);

  const user = users.find(u => u.email === 'testmanager123@gmail.com');
  if (!user) return console.log('User not found');

  const { error: insertError } = await supabase.from('users').upsert({
    id: user.id,
    username: 'testmanager123',
    provider: 'email'
  });

  if (insertError) console.error('Error syncing user:', insertError);
  else console.log('User synced to public.users successfully!');
}
syncUser();
