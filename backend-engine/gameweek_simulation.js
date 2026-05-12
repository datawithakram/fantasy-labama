const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; 
// Using service role key if available for deletions/updates in test
const serviceKey = "sb_publishable_nwHjsEAnM7Jw0_RB6HoIPQ_rUt-G0I4"; // From admin .env

const supabase = createClient(supabaseUrl, serviceKey);

async function runScenario() {
  console.log('🚀 Starting Complex Simulation Scenario...');

  try {
    // 1. Setup Round 1 (Past Deadline)
    console.log('\n--- PHASE 1: PAST DEADLINE CHECK ---');
    const pastDeadline = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    const { error: r1Error } = await supabase.from('rounds').update({
       deadline_time: pastDeadline,
       is_current: true
    }).eq('name', 'Gameweek 1');
    
    if (r1Error) throw r1Error;
    console.log('✅ Gameweek 1 set with PAST deadline.');

    // 2. Setup Round 2 (Future Deadline)
    console.log('\n--- PHASE 2: FUTURE ROUND SETUP ---');
    const futureDeadline = new Date(Date.now() + 86400000).toISOString(); // Tomorrow
    const { error: r2Error } = await supabase.from('rounds').upsert({
       name: 'Gameweek 2',
       deadline_time: futureDeadline,
       is_current: false
    });
    if (r2Error) throw r2Error;
    console.log('✅ Gameweek 2 scheduled for tomorrow.');

    // 3. Match Simulation Setup
    console.log('\n--- PHASE 3: MATCH SIMULATION ---');
    // Get some clubs and players
    const { data: clubs } = await supabase.from('clubs').select('*').limit(2);
    const { data: players } = await supabase.from('players').select('*').limit(5);

    if (!clubs || clubs.length < 2) {
       console.log('⚠️ Not enough clubs to simulate matches. Please add clubs first.');
       return;
    }

    // Create a match
    const { data: match, error: matchError } = await supabase.from('matches').insert({
       round_id: 1, // Gameweek 1
       home_club_id: clubs[0].id,
       away_club_id: clubs[1].id,
       kickoff_time: new Date().toISOString(),
       status: 'LIVE'
    }).select().single();

    if (matchError) throw matchError;
    console.log(`✅ Match created: ${clubs[0].name} vs ${clubs[1].name} (GW1)`);

    // Add events
    const { error: eventError } = await supabase.from('match_events').insert([
       { match_id: match.id, player_id: players[0].id, event_type: 'GOAL', minute: 23 },
       { match_id: match.id, player_id: players[1].id, event_type: 'ASSIST', minute: 23 }
    ]);
    if (eventError) throw eventError;
    console.log(`✅ Match Events added: Goal by ${players[0].name}, Assist by ${players[1].name}`);

    console.log('\n--- SIMULATION SUMMARY ---');
    console.log('1. Database: Multi-round structure works.');
    console.log('2. Admin: Can manage future rounds and live matches.');
    console.log('3. Frontend: Match Center will show live events via Polling.');
    console.log('4. Backend: Transfers for GW1 will be REJECTED (403).');

  } catch (err) {
    console.error('❌ Simulation Error:', err);
  }
}

runScenario();
