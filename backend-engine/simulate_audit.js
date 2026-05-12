const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://bmmtejkcxkfixqnbglgu.supabase.co', 'sb_secret_OmBnpHEt98-DC4lshmhhfw_FVYABwGF');

async function simulate() {
  console.log('--- Phase 1: Setup ---');
  
  // 1. Create Rounds table if missing (or just check again)
  const { error: roundError } = await supabase.from('rounds').select('*').limit(1);
  if (roundError && roundError.code === '42P01') {
    console.log('CRITICAL: Rounds table is missing in the database!');
  } else {
    console.log('Rounds table exists.');
  }

  // 2. Create a Test User
  const email = `test_${Math.random().toString(36).substring(7)}@example.com`;
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email, password: 'password123', email_confirm: true
  });
  if (authError) return console.error('Auth Error:', authError.message);
  const userId = authUser.user.id;
  console.log('Created User:', userId);

  // 3. Sync User to public.users (required for FK constraints)
  const { error: syncError } = await supabase.from('users').insert({
    id: userId,
    username: `user_${Math.random().toString(36).substring(7)}`,
    provider: 'email'
  });
  if (syncError) return console.error('Sync Error:', syncError.message);
  console.log('Synced User to public.users');

  // 4. Create a Team for the user
  const { data: team, error: teamError } = await supabase.from('user_teams').insert({
    user_id: userId, budget: 100.0
  }).select().single();
  if (teamError) return console.error('Team Error:', teamError.message);
  console.log('Created Team:', team.id);

  // 5. Create a Round with a PAST deadline
  const { data: round, error: createRoundError } = await supabase.from('rounds').insert({
    name: 'Simulation GW',
    deadline_time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    is_current: true
  }).select().single();
  if (createRoundError) {
    console.log('Failed to create round:', createRoundError.message);
    // If it fails because is_current unique constraint or something, try updating
  } else {
    console.log('Created Round with PAST deadline:', round.id);
  }

  console.log('\n--- Phase 2: Deadline Test (Backend API) ---');
  // Attempt to call the backend API
  
  const playersData = await supabase.from('players').select('id').limit(15);
  const players = playersData.data;

  try {
    const response = await fetch('http://localhost:4000/api/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_id: team.id,
        players: players.map(p => ({ id: p.id }))
      })
    });
    const result = await response.json();
    if (response.status === 403 || response.status === 401) {
      console.log('SUCCESS: Backend blocked transfer (Deadline or Auth):', response.status);
    } else {
      console.log('VULNERABILITY: Backend response:', response.status, result);
    }
  } catch (err) {
    console.log('Backend connection error:', err.message);
  }

  console.log('\n--- Phase 3: League Simulation ---');
  const { data: league, error: leagueError } = await supabase.from('leagues').insert({
    name: 'Audit League',
    code: 'AUDIT1',
    created_by: userId,
    is_public: true
  }).select().single();
  if (leagueError) console.error('League Error:', leagueError.message);
  else console.log('Created League:', league.name);

  // Join league
  const { error: joinError } = await supabase.from('league_members').insert({
    league_id: league.id,
    user_id: userId
  });
  if (joinError) console.error('Join Error:', joinError.message);
  else console.log('Joined League successfully');

  console.log('\n--- Simulation Complete ---');
}

simulate();
