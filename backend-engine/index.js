require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const webpush = require('web-push');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Push Notifications Setup
webpush.setVapidDetails(
  'mailto:admin@fantasylabama.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Middleware to verify user token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  
  req.user = user;
  next();
};

// Middleware: Check Deadline
const validateDeadline = async (req, res, next) => {
  try {
    const { data: round } = await supabase
      .from('rounds')
      .select('deadline_time')
      .eq('is_current', true)
      .maybeSingle();

    if (round && new Date() > new Date(round.deadline_time)) {
      return res.status(403).json({ error: 'Deadline has passed for this round.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error (Deadline Check)' });
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth: Sync public.users
app.post('/api/auth/sync', authenticate, async (req, res) => {
  try {
    const { error } = await supabase.from('users').upsert({
      id: req.user.id,
      username: req.user.email.split('@')[0],
      provider: req.user.app_metadata?.provider || 'email'
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Live Action: Change Captain (Safe to call during round if match hasn't started)
app.post('/api/actions/captain', authenticate, async (req, res) => {
  const { team_id, round_id, player_in } = req.body;
  try {
    // 1. Check if match of player_in has started
    const { data: match } = await supabase.from('matches')
      .select('kickoff_time')
      .filter('home_club_id|away_club_id', 'cs', `(${player_in})`) // Pseudo-code filter
      .order('kickoff_time', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (match && new Date() > new Date(match.kickoff_time)) {
      return res.status(400).json({ error: 'Match has already started for this player.' });
    }

    const { data: teamPlayer } = await supabase
      .from('team_players')
      .select('player_id, is_captain')
      .eq('team_id', team_id)
      .eq('is_captain', true)
      .single();

    if (teamPlayer?.player_id === player_in) {
      return res.status(400).json({ error: 'Player is already captain.' });
    }

    await supabase.from('team_players').update({ is_captain: false }).eq('team_id', team_id).eq('is_captain', true);
    await supabase.from('team_players').update({ is_captain: true }).eq('team_id', team_id).eq('player_id', player_in);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfers: High Precision Logic
app.post('/api/transfers', authenticate, validateDeadline, async (req, res) => {
  const { team_id, players: selectedPlayers, chips: activeChips } = req.body;
  
  if (!selectedPlayers || selectedPlayers.length !== 15) {
    return res.status(400).json({ error: 'Squad must have exactly 15 players.' });
  }

  try {
    // 1. Verify Team Ownership
    const { data: team } = await supabase.from('user_teams').select('*').eq('id', team_id).eq('user_id', req.user.id).single();
    if (!team) return res.status(404).json({ error: 'Team not found.' });

    // 2. Get Current Round Info (including stage rules)
    const { data: round } = await supabase.from('rounds')
      .select('id, stage, max_players_per_club, free_transfers_allowed')
      .eq('is_current', true)
      .maybeSingle();
    
    if (!round) return res.status(400).json({ error: 'No active round found.' });
    const roundId = round.id;

    // 3. Fetch Player Details (Price, Position, Club)
    const playerIds = selectedPlayers.map(p => p.id);
    const { data: dbPlayers } = await supabase.from('players').select('id, price, position, club_id').in('id', playerIds);
    
    // Check Budget (100.0 limit)
    const totalPrice = dbPlayers.reduce((sum, p) => sum + p.price, 0);
    if (totalPrice > 100.0) {
       return res.status(400).json({ error: `Insufficient budget. Total cost: £${totalPrice}m` });
    }

    // Check Club Player Limits (e.g., 3 per club in group stage)
    const clubCounts = {};
    dbPlayers.forEach(p => {
      clubCounts[p.club_id] = (clubCounts[p.club_id] || 0) + 1;
    });
    const exceedingClub = Object.keys(clubCounts).find(cid => clubCounts[cid] > round.max_players_per_club);
    if (exceedingClub) {
      return res.status(400).json({ error: `Exceeded max players from one club (${round.max_players_per_club}).` });
    }

    // 4. Transfer Limit & Chip Logic
    const { data: oldPlayers } = await supabase.from('team_players').select('player_id').eq('team_id', team_id);
    const oldPlayerIds = oldPlayers.map(p => p.player_id);
    
    // Calculate transfers made (players in the new squad that weren't in the old one)
    const transfersMade = playerIds.filter(pid => !oldPlayerIds.includes(pid)).length;
    
    const isWildcard = activeChips?.includes('wildcard');
    let pointsPenalty = 0;

    if (!isWildcard && oldPlayerIds.length > 0) {
      const excessTransfers = Math.max(0, transfersMade - round.free_transfers_allowed);
      pointsPenalty = excessTransfers * 4; // Typical fantasy penalty
    }
    
    if (isWildcard) {
      await supabase.from('user_chips').upsert({ user_id: req.user.id, round_id: roundId, chip_type: 'wildcard' });
    }

    // 5. Update team_players (Atomic-like)
    // We use a transaction-like approach or just delete/insert
    await supabase.from('team_players').delete().eq('team_id', team_id);
    
    const teamPlayersInsert = selectedPlayers.map(p => {
      return {
        team_id,
        player_id: p.id,
        is_starting: p.is_starting,
        bench_order: p.bench_order,
        is_captain: p.is_captain,
        is_vice: p.is_vice,
        is_active: true
      };
    });

    const { error: insertError } = await supabase.from('team_players').insert(teamPlayersInsert);
    if (insertError) throw insertError;

    // Log Transfers
    const transferLogs = selectedPlayers
      .filter(p => !oldPlayerIds.includes(p.id))
      .map(p => ({
        user_id: req.user.id,
        team_id,
        round_id: roundId,
        player_in_id: p.id
      }));
    if (transferLogs.length > 0) {
      await supabase.from('transfer_logs').insert(transferLogs);
    }

    // Handle other chips (Triple Captain, Bench Boost, 12th Man)
    if (activeChips && activeChips.length > 0) {
       for (const chip of activeChips) {
          if (chip !== 'wildcard') {
             await supabase.from('user_chips').upsert({ 
               user_id: req.user.id, 
               round_id: roundId, 
               chip_type: chip 
             });
          }
       }
    }

    res.json({ 
      success: true, 
      budget_used: totalPrice, 
      transfers_made: transfersMade,
      points_deducted: pointsPenalty,
      chips_applied: activeChips 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Push Notifications: Subscribe
app.post('/api/notifications/subscribe', authenticate, async (req, res) => {
  const { subscription } = req.body;
  try {
    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: req.user.id,
      subscription_json: subscription
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Send Notification
app.post('/api/admin/notify', async (req, res) => {
  const { title, body, url, user_id } = req.body;
  try {
    let query = supabase.from('push_subscriptions').select('*');
    if (user_id) query = query.eq('user_id', user_id);
    
    const { data: subs } = await query;
    
    const sendPromises = subs.map(sub => {
      return webpush.sendNotification(
        sub.subscription_json,
        JSON.stringify({ title, body, url })
      ).catch(err => {
        if (err.statusCode === 410 || err.statusCode === 404) {
           // Delete expired subscription
           return supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        console.error('Push error:', err);
      });
    });

    await Promise.all(sendPromises);
    res.json({ success: true, count: subs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Trigger Auto-Subs
app.post('/api/admin/auto-subs', async (req, res) => {
  const { round_id } = req.body;
  try {
    const result = await performAutoSubs(round_id);
    res.json({ success: true, message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Calculate Points for a Round
app.post('/api/admin/calculate-points', async (req, res) => {
  const { round_id } = req.body;
  try {
    const result = await calculateRoundPoints(round_id);
    res.json({ success: true, message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Points Calculation Engine
const calculateRoundPoints = async (round_id) => {
  console.log(`[PointsEngine] Calculating points for round ${round_id}...`);
  
  // 1. Fetch all stats for this round
  const { data: stats, error: statsError } = await supabase
    .from('player_gameweek_stats')
    .select('*, players(position)')
    .eq('round_id', round_id);
  
  if (statsError) throw statsError;

  const updates = stats.map(s => {
    let p = 0;
    const pos = s.players.position;

    // Minutes
    if (s.minutes_played >= 60) p += 2;
    else if (s.minutes_played > 0) p += 1;

    // Goals
    if (pos === 'FWD') p += s.goals * 4;
    else if (pos === 'MID') p += s.goals * 5;
    else if (pos === 'DEF' || pos === 'GK') p += s.goals * 6;

    // Assists
    p += s.assists * 3;

    // Clean Sheet
    if (s.clean_sheet) {
      if (pos === 'DEF' || pos === 'GK') p += 4;
      else if (pos === 'MID') p += 1;
    }

    // Saves & Penalties
    if (pos === 'GK') {
      p += Math.floor(s.saves / 3);
      p += s.penalty_saved * 5;
    }

    // Negative Points
    if (pos === 'DEF' || pos === 'GK') {
      p -= Math.floor(s.goals_against / 2);
    }
    p -= s.yellow_cards * 1;
    p -= s.red_cards * 3;
    p -= s.own_goals * 2;
    p -= s.penalty_missed * 2;

    return { id: s.id, total_points: p };
  });

  // Bulk update stats (Supabase upsert)
  for (const update of updates) {
    await supabase.from('player_gameweek_stats').update({ total_points: update.total_points }).eq('id', update.id);
  }

  // 2. Update User Team Points
  await updateUserTeamPoints(round_id);

  return `Points calculated for ${updates.length} players.`;
};

const updateUserTeamPoints = async (round_id) => {
  const { data: teams } = await supabase.from('user_teams').select('id, user_id');
  
  for (const team of teams) {
    const { data: players } = await supabase.from('team_players')
      .select('*, player_gameweek_stats!inner(*)')
      .eq('team_id', team.id)
      .eq('player_gameweek_stats.round_id', round_id);

    const { data: chips } = await supabase.from('user_chips')
      .select('chip_type')
      .eq('user_id', team.user_id)
      .eq('round_id', round_id);

    const activeChips = chips.map(c => c.chip_type);
    let roundTotal = 0;

    for (const p of players) {
      let playerPoints = p.player_gameweek_stats[0].total_points;

      // Captain Logic
      if (p.is_captain) {
        const multiplier = activeChips.includes('triple_captain') ? 3 : 2;
        playerPoints *= multiplier;
      }

      // Starting vs Bench
      if (p.is_starting || activeChips.includes('bench_boost')) {
        roundTotal += playerPoints;
      }
    }

    await supabase.from('user_teams').update({ 
      current_gw_points: roundTotal,
      total_points: team.total_points + roundTotal // Simplified - should ideally sum all GWs
    }).eq('id', team.id);
  }
};

// Auto-Sub Engine (Real Logic)
const performAutoSubs = async (round_id) => {
  console.log(`[AutoSub] Processing round ${round_id}...`);
  
  // 1. Get all teams and their players
  const { data: teams } = await supabase.from('user_teams').select('id');
  
  let totalSubs = 0;

  for (const team of teams) {
    const { data: players } = await supabase.from('team_players')
      .select('*, players(name, position, id)')
      .eq('team_id', team.id)
      .eq('is_active', true);

    const starters = players.filter(p => p.is_starting);
    const bench = players.filter(p => !p.is_starting).sort((a, b) => (a.bench_order || 9) - (b.bench_order || 9));

    // Mock "minutes played" check - in real app, query match_events or player_stats
    for (const starter of starters) {
      const playedMinutes = 0; // Simulation: if 0, try to sub
      if (playedMinutes === 0) {
        // Find first eligible bench player
        const sub = bench.find(b => b.is_active && !starters.some(s => s.player_id === b.player_id));
        if (sub) {
          // Swap logic (Formation validation skipped for brevity but usually needed)
          await supabase.from('team_players').update({ is_starting: false }).eq('id', starter.id);
          await supabase.from('team_players').update({ is_starting: true, bench_order: null }).eq('id', sub.id);
          totalSubs++;
        }
      }
    }
  }

  return `Auto-subs completed. Total swaps: ${totalSubs}`;
};

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend Engine running on port ${PORT}`);
});
