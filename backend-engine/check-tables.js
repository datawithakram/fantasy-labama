const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function checkTables() {
  const tables = ['teams', 'rounds', 'leagues', 'league_members', 'match_events', 'matches', 'clubs'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: Not found or Error: ${error.message}`);
    } else {
      console.log(`Table ${table}: Found (${data.length} records)`);
    }
  }
}
checkTables();
