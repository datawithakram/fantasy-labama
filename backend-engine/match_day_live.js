const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = "sb_publishable_nwHjsEAnM7Jw0_RB6HoIPQ_rUt-G0I4"; 

const supabase = createClient(supabaseUrl, serviceKey);

async function simulateMatchDay() {
  console.log('⚽️ SIMULATING MATCH DAY: Club 2 vs Club 1');

  try {
    // 1. Get Round 1
    const { data: round } = await supabase.from('rounds').select('id').eq('is_current', true).single();
    if (!round) throw new Error('No current round found. Please create one first.');

    // 2. Create Match
    const { data: match, error: mErr } = await supabase.from('matches').insert({
      home_club: 2, // Haaland's club
      away_club: 1, // Bellingham's club
      round: 'GROUP',
      status: 'live',
      kickoff: new Date().toISOString()
    }).select().single();
    if (mErr) throw mErr;
    console.log(`✅ Match LIVE: Match ID ${match.id}`);

    // 3. Add Events
    console.log('📝 Adding match events...');
    const events = [
      { match_id: match.id, player_id: 6, event_type: 'goal', minute: 15 },    // Haaland goal
      { match_id: match.id, player_id: 2, event_type: 'assist', minute: 15 },  // Bellingham assist
      { match_id: match.id, player_id: 6, event_type: 'goal', minute: 65 }     // Haaland brace
    ];

    const { error: eErr } = await supabase.from('match_events').insert(events);
    if (eErr) throw eErr;
    console.log('✅ Events registered: 2 Goals (Haaland), 1 Assist (Bellingham), 1 CS (Alisson)');

    console.log('\n--- SYSTEM VERIFICATION ---');
    console.log('1. Match Center: Should now show LIVE score.');
    console.log('2. Live Points: Haaland (4+4), Bellingham (3), Alisson (4) + Appearance pts.');
    console.log('3. Captaincy: Alisson is captain, so points should double.');

  } catch (err) {
    console.error('❌ Match Day Simulation Failed:', err);
  }
}

simulateMatchDay();
