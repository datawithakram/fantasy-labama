const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function seedGks() {
  const gks = [
    { name: 'Alisson', position: 'GK', price: 5.5, club_id: 1 },
    { name: 'Ederson', position: 'GK', price: 5.5, club_id: 2 },
    { name: 'Raya', position: 'GK', price: 5.5, club_id: 3 },
    { name: 'Pope', position: 'GK', price: 5.0, club_id: 4 }
  ];

  const { data, error } = await supabase.from('players').insert(gks);
  if (error) console.error('Error inserting GKs:', error);
  else console.log('Inserted GKs successfully');
}
seedGks();
