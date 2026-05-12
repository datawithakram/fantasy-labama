const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = "sb_publishable_nwHjsEAnM7Jw0_RB6HoIPQ_rUt-G0I4"; 

const supabase = createClient(supabaseUrl, serviceKey);

async function endRound() {
  console.log('🏁 FINALIZING ROUND 1 AND UPDATING LEADERBOARD...');

  try {
    // 1. Get Current Round
    const { data: round } = await supabase.from('rounds').select('id').eq('is_current', true).single();
    if (!round) throw new Error('No active round to end.');

    // 2. Fetch all match events for this round
    const { data: events } = await supabase.from('match_events').select('*, players(position)');
    
    // 3. Calculate points per player
    const playerPoints = {};
    events.forEach(event => {
      const pid = event.player_id;
      if (!playerPoints[pid]) playerPoints[pid] = 0; // Base points handled by 'minutes' or appearance

      const pos = event.players.position;
      
      switch(event.event_type) {
        case 'goal':
          if (pos === 'FWD') playerPoints[pid] += 4;
          else if (pos === 'MID') playerPoints[pid] += 5;
          else playerPoints[pid] += 6;
          break;
        case 'assist':
          playerPoints[pid] += 3;
          break;
        case 'save':
          playerPoints[pid] += 1; // Simplified: 1 pt per save record
          break;
        case 'penalty_save':
          playerPoints[pid] += 5;
          break;
        case 'yellow':
          playerPoints[pid] -= 1;
          break;
        case 'red':
          playerPoints[pid] -= 3;
          break;
        case 'own_goal':
          playerPoints[pid] -= 2;
          break;
        case 'penalty_miss':
          playerPoints[pid] -= 2;
          break;
        case 'minutes':
          playerPoints[pid] += (event.minute >= 60 ? 2 : 1);
          break;
      }
    });

    // 4. Get all teams and their active chips
    const { data: teams } = await supabase.from('user_teams').select('id, user_id');
    const { data: activeChips } = await supabase.from('user_chips').select('*').eq('round_id', round.id);
    
    for (const team of teams) {
      const { data: roster } = await supabase.from('team_players').select('*').eq('team_id', team.id);
      const teamChips = activeChips.filter(c => c.user_id === team.user_id).map(c => c.chip_type);
      
      const isBenchBoost = teamChips.includes('bench_boost');
      const isTripleCaptain = teamChips.includes('triple_captain');

      let totalTeamPoints = 0;
      
      // Determine captain points
      const captain = roster.find(p => p.is_captain);
      const vice = roster.find(p => p.is_vice);
      
      let capMultiplier = isTripleCaptain ? 3 : 2;
      let capPts = (playerPoints[captain?.player_id] || 0);
      
      // Vice-captain logic: if captain didn't play (0 pts and no minutes event usually)
      // For simplicity: if captain pts == 0, check vice
      if (capPts === 0 && vice) {
         capPts = (playerPoints[vice.player_id] || 0);
      }
      
      roster.forEach(p => {
        const isStarter = p.is_starting;
        let pts = playerPoints[p.player_id] || 0;
        
        if (p.is_captain || (capPts > 0 && p.is_vice && playerPoints[captain?.player_id] === 0)) {
           // Already handled by capPts logic if it's the active captain
        }

        if (isStarter || isBenchBoost) {
           totalTeamPoints += pts;
        }
      });

      // Add the extra captain bonus (multiplier - 1)
      totalTeamPoints += (capPts * (capMultiplier - 1));

      console.log(`📊 Team ${team.id}: Calculated ${totalTeamPoints} points. (Chips: ${teamChips.join(', ')})`);

      // 5. Save to team_scores
      const { error: sErr } = await supabase.from('team_scores').upsert({
        team_id: team.id,
        round_id: round.id,
        points: totalTeamPoints
      });
      if (sErr) console.error(`Error saving score for team ${team.id}:`, sErr);
    }

    // 6. Close Round
    await supabase.from('rounds').update({ is_current: false }).eq('id', round.id);
    console.log('✅ Round 1 CLOSED. Points archived to Leaderboard.');

  } catch (err) {
    console.error('❌ End Round Process Failed:', err);
  }
}

endRound();
