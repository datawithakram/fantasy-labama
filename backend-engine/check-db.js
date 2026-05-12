const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function checkData() {
  const { data: players } = await supabase.from('players').select('id, position, club_id');
  if (!players) return console.log('No players found or error');
  
  const posCount = players.reduce((acc, p) => { acc[p.position] = (acc[p.position] || 0) + 1; return acc; }, {});
  const clubCount = players.reduce((acc, p) => { acc[p.club_id] = (acc[p.club_id] || 0) + 1; return acc; }, {});
  
  console.log('Position count:', posCount);
  console.log('Club count:', clubCount);
}
checkData();
