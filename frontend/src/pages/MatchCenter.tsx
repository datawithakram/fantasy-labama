import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { RefreshCw, AlertCircle, TrendingUp, Calendar, Info, Clock, PlayCircle, CheckCircle2, XCircle, Zap, Activity, Trophy, Search, ChevronRight, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Player } from '../store/teamStore';

interface TeamPlayer extends Player {
  team_player_id: number;
  is_starting: boolean;
  is_captain: boolean;
  is_vice: boolean;
  is_active: boolean;
  matchStatus: 'not_started' | 'live' | 'finished';
  points: number;
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

import { PlayerInfoModal } from '../components/PlayerInfoModal';

export function MatchCenter() {
  const { user } = useStore();
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayer[]>([]);
  const [clubs, setClubs] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'warning' } | null>(null);
  const [infoState, setInfoState] = useState<{ isOpen: boolean; player: any | null }>({
    isOpen: false,
    player: null
  });

  useEffect(() => {
    if (!user) return;
    loadLiveTeam();
    const interval = setInterval(loadLiveTeam, 30000); 
    return () => clearInterval(interval);
  }, [user]);

  async function loadLiveTeam() {
    console.log('[MatchCenter] Polling live team data...');
    try {
      const fetchTeam = Promise.resolve(supabase.from('user_teams').select('id').eq('user_id', user?.id).maybeSingle()).then(res => res.data).catch(() => null);
      const fetchClubs = Promise.resolve(supabase.from('clubs').select('*')).then(res => res.data).catch(() => []);

      const [team, clubsData] = await Promise.all([fetchTeam, fetchClubs]);

      if (clubsData) {
        const clubMap = clubsData.reduce((acc, club) => {
          acc[club.id] = club;
          return acc;
        }, {} as Record<number, any>);
        setClubs(clubMap);
      }

      if (!team) {
        setLoading(false);
        return;
      }
      setTeamId(team.id);

      const { data: players } = await supabase
        .from('team_players')
        .select(`
          id, is_starting, is_captain, is_vice, is_active,
          players (id, name, position, price, club_id)
        `)
        .eq('team_id', team.id);

      if (players) {
        const clubIds = players.map((p: any) => p.players.club_id);
        const { data: matches } = await supabase
          .from('matches')
          .select('*')
          .or(`home_club.in.(${clubIds.join(',')}),away_club.in.(${clubIds.join(',')})`);

        const { data: events } = await supabase
          .from('match_events')
          .select('*')
          .in('match_id', matches?.map(m => m.id) || []);

        const mapped = players.map((p: any) => {
          const clubMatch = matches?.find(m => m.home_club === p.players.club_id || m.away_club === p.players.club_id);
          let matchStatus: 'not_started' | 'live' | 'finished' = clubMatch?.status || 'not_started';

          let points = 0;
          if (events && clubMatch) {
            const playerEvents = events.filter(e => e.player_id === p.players.id && e.match_id === clubMatch.id);
            points = playerEvents.reduce((acc, e) => {
              if (e.event_type === 'goal') return acc + (p.players.position === 'FWD' ? 4 : p.players.position === 'MID' ? 5 : 6);
              if (e.event_type === 'assist') return acc + 3;
              if (e.event_type === 'yellow') return acc - 1;
              if (e.event_type === 'red') return acc - 3;
              return acc;
            }, 0);
            if (playerEvents.length > 0 || matchStatus !== 'not_started') points += 2;
          }
          if (p.is_captain) points *= 2;

          return {
            ...p.players,
            team_player_id: p.id,
            is_starting: p.is_starting,
            is_captain: p.is_captain,
            is_vice: p.is_vice,
            is_active: p.is_active,
            matchStatus,
            points
          };
        });
        setTeamPlayers(mapped);
        console.log('[MatchCenter] Live squad synced:', mapped.length, 'players');
      }
    } catch (err) {
      console.error('[MatchCenter] Sync error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCaptainChange = async (player: TeamPlayer) => {
    console.log('[MatchCenter] Attempting captain change to:', player.name);
    
    if (player.matchStatus !== 'not_started') {
      console.warn('[MatchCenter] Captain change blocked: match already started');
      setMessage({ text: 'Cannot captain a player whose match has already started.', type: 'error' });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payload = { team_id: teamId, round_id: 1, player_in: player.id };
      console.log('[MatchCenter] Sending captain change payload:', payload);

      const response = await fetch(`${API_BASE_URL}/actions/captain`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('[MatchCenter] API Response:', result);

      if (result.success) {
        setMessage({ text: 'Captain changed successfully!', type: 'success' });
        loadLiveTeam();
      } else {
        setMessage({ text: result.error || 'Failed to change captain.', type: 'error' });
      }
    } catch (err: any) {
      console.error('[MatchCenter] Captain change error:', err);
      setMessage({ text: 'API Connection Error', type: 'error' });
    }
  };

  const starters = teamPlayers.filter(p => p.is_starting);
  const bench = teamPlayers.filter(p => !p.is_starting);
  const totalPoints = starters.reduce((sum, p) => sum + p.points, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started': return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase flex items-center gap-1"><Clock className="w-2 h-2" /> Upcoming</span>;
      case 'live': return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase flex items-center gap-1 animate-pulse"><PlayCircle className="w-2 h-2" /> Live</span>;
      case 'finished': return <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[8px] font-black uppercase flex items-center gap-1"><CheckCircle2 className="w-2 h-2" /> Full Time</span>;
      default: return null;
    }
  };

  if (loading && teamPlayers.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Activity className="w-12 h-12 text-[var(--primary)] animate-pulse" />
        <p className="font-black italic uppercase tracking-tighter text-[var(--muted-foreground)]">Scanning live pitch data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      {/* Sticky Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 -mx-4 px-4 py-3 bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/30">
               <TrendingUp className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[8px] font-black uppercase text-[var(--muted-foreground)] leading-none mb-1">Live Score</p>
               <p className="text-xl font-black italic">{totalPoints} pts</p>
            </div>
         </div>
         <button onClick={loadLiveTeam} className="p-2 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]">
            <RefreshCw className="w-5 h-5" />
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch">
         <div className="hidden md:flex flex-1 flex gap-3 md:gap-4">
            <div className="fantasy-card flex-1 min-w-[200px] p-6 flex items-center gap-5 bg-gradient-to-br from-[var(--primary)] to-indigo-700 text-white border-none shadow-xl shadow-[var(--primary)]/20">
               <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"><TrendingUp className="w-8 h-8" /></div>
               <div>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Live Gameweek Points</p>
                  <p className="text-4xl font-black italic">{totalPoints}</p>
               </div>
            </div>
            <div className="fantasy-card flex-1 min-w-[200px] p-6 flex items-center gap-5 bg-gradient-to-br from-[var(--card)] to-[var(--muted)]">
               <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Activity className="w-8 h-8" /></div>
               <div>
                  <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest leading-none mb-1">System Status</p>
                  <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                     <p className="text-xl font-black uppercase tracking-tighter">Live Updates</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="hidden md:flex items-center gap-3">
            <button onClick={loadLiveTeam} className="fantasy-button bg-[var(--card)] border border-[var(--border)] p-4 flex items-center gap-2 hover:bg-[var(--muted)]">
               <RefreshCw className="w-5 h-5" />
            </button>
            <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl flex flex-col justify-center">
               <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Active Round</p>
               <p className="text-sm font-black italic">GW 12 • 2026</p>
            </div>
         </div>
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-4 font-bold border-2 animate-in zoom-in duration-300",
          message.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          {message.type === 'error' ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          <p className="text-sm uppercase tracking-tight">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                 Starting <span className="text-[var(--primary)]">XI</span>
                 <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[10px] font-black not-italic text-[var(--muted-foreground)]">11</div>
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {starters.map(player => (
                 <div 
                    key={player.id} 
                    onClick={() => setInfoState({ isOpen: true, player })}
                    className={cn(
                       "fantasy-card p-4 md:p-5 group relative transition-all hover:shadow-xl cursor-pointer",
                       player.matchStatus === 'live' ? "border-[var(--primary)] bg-gradient-to-br from-[var(--card)] to-[var(--primary)]/5" : ""
                    )}
                 >
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3 md:gap-4">
                          <div className={cn(
                             "w-10 h-12 md:w-12 md:h-14 rounded-xl flex items-center justify-center text-white relative shadow-lg",
                             player.position === 'GK' ? "bg-amber-400" : "bg-indigo-500"
                          )}>
                             <Shield className="w-5 h-5 md:w-6 md:h-6 opacity-20" />
                             {player.is_captain && <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[6px] md:text-[8px] font-black w-4 h-4 md:w-5 md:h-5 rounded-lg flex items-center justify-center border-2 border-white shadow-lg animate-bounce">C</div>}
                          </div>
                          <div>
                             <h4 className="text-sm md:text-base font-black text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{player.name}</h4>
                             <div className="mt-1">{getStatusBadge(player.matchStatus)}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Points</p>
                          <p className="text-2xl md:text-3xl font-black italic leading-none text-[var(--primary)]">{player.points}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                       <div className="flex gap-3 md:gap-4">
                          <div className="text-center">
                             <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase">Pos</p>
                             <p className="text-[10px] md:text-xs font-black">{player.position}</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase">Value</p>
                             <p className="text-[10px] md:text-xs font-black">£{player.price}m</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                          {!player.is_captain && player.matchStatus === 'not_started' && (
                             <button 
                                onClick={() => handleCaptainChange(player)}
                                className="p-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                             >
                                <Zap className="w-4 h-4" />
                             </button>
                          )}
                          <button className="p-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                             <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="space-y-8 md:space-y-10">
           <section className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                 Sub <span className="text-[var(--primary)]">Bench</span>
                 <div className="w-8 h-8 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[10px] font-black not-italic text-[var(--muted-foreground)]">4</div>
              </h2>
              
              <div className="space-y-3">
                 {bench.map(player => (
                    <div 
                       key={player.id} 
                       onClick={() => setInfoState({ isOpen: true, player })}
                       className="fantasy-card p-4 flex items-center justify-between hover:border-[var(--primary)] transition-all group shadow-sm cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-12 bg-[var(--muted)] rounded-lg flex items-center justify-center text-[var(--muted-foreground)] text-[10px] font-black group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] transition-all shadow-inner">
                             {player.position}
                          </div>
                          <div>
                             <h5 className="text-sm font-black text-[var(--foreground)]">{player.name}</h5>
                             <div className="mt-1">{getStatusBadge(player.matchStatus)}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black italic text-[var(--primary)]">{player.points}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="fantasy-card bg-slate-900 text-white p-6 border-none overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4 flex items-center gap-2">
                 <Trophy className="w-5 h-5 text-amber-500" /> Live Feed
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 animate-pulse"></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Latest Update</p>
                       <p className="text-xs font-bold leading-relaxed">Goal scored in Liverpool vs Chelsea match. System calculating potential bonus points.</p>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>

      <PlayerInfoModal
        isOpen={infoState.isOpen}
        onClose={() => setInfoState(prev => ({ ...prev, isOpen: false }))}
        player={infoState.player}
        clubName={infoState.player ? clubs[infoState.player.club_id]?.name : ''}
      />
    </div>
  );
}