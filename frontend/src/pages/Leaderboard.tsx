import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Medal, User, TrendingUp, Trophy, Search, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_points: number;
  rank: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    console.log('[Leaderboard] Fetching global rankings...');
    try {
      const { data, error } = await supabase
        .from('team_scores')
        .select(`
          points,
          user_teams (
            user_id,
            users (
              username
            )
          )
        `);

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
           console.warn('[Leaderboard] Table not found, showing empty rankings');
           setEntries([]);
           return;
        }
        throw error;
      }

      const userPoints: Record<string, { username: string, points: number }> = {};
      data?.forEach((row: any) => {
        if (!row.user_teams) return;
        const userId = row.user_teams.user_id;
        const username = row.user_teams.users.username;
        if (!userPoints[userId]) {
          userPoints[userId] = { username, points: 0 };
        }
        userPoints[userId].points += row.points || 0;
      });

      const sortedEntries = Object.entries(userPoints)
        .map(([userId, info]) => ({
          user_id: userId,
          username: info.username,
          total_points: info.points,
          rank: 0
        }))
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setEntries(sortedEntries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Global <span className="text-[var(--primary)]">Rankings</span></h1>
            <p className="text-[var(--muted-foreground)] font-bold">The definitive leaderboard for Fantasy Labama.</p>
         </div>
         <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
               type="text" 
               placeholder="Find manager..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-sm"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
         <div className="lg:col-span-2">
            <div className="fantasy-card p-0 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30">
               <div className="bg-slate-900/5 px-6 py-4 border-b border-[var(--border)] grid grid-cols-12 gap-4 text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em]">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-7">Manager</div>
                  <div className="col-span-3 text-right">Points</div>
               </div>

               {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                     <Activity className="w-10 h-10 animate-spin" />
                     <p className="font-black uppercase text-xs tracking-widest">Calculating Standings...</p>
                  </div>
               ) : filteredEntries.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                     <Trophy className="w-12 h-12 mx-auto mb-4" />
                     <p className="font-black uppercase tracking-widest italic">No managers found</p>
                  </div>
               ) : (
                  <div className="divide-y divide-[var(--border)]">
                     {filteredEntries.map((entry) => (
                        <div key={entry.user_id} className="px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-[var(--primary)]/5 transition-all cursor-pointer group">
                           <div className="col-span-2">
                              <span className={cn(
                                 "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm",
                                 entry.rank === 1 ? "bg-amber-400 text-white shadow-amber-500/30" : 
                                 entry.rank === 2 ? "bg-slate-300 text-slate-700 shadow-slate-400/30" : 
                                 entry.rank === 3 ? "bg-amber-700 text-white shadow-amber-800/30" : 
                                 "bg-[var(--muted)] text-[var(--muted-foreground)]"
                              )}>
                                 {entry.rank}
                              </span>
                           </div>
                           <div className="col-span-7 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                                 <User className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="font-black text-[var(--foreground)] truncate uppercase tracking-tight text-sm">{entry.username}</p>
                                 <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Manager</p>
                              </div>
                           </div>
                           <div className="col-span-3 text-right">
                              <p className="text-xl md:text-2xl font-black italic text-[var(--primary)]">{entry.total_points}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <div className="space-y-8">
            <section className="fantasy-card p-6 bg-[var(--primary)] text-white border-none shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <Medal className="w-6 h-6 text-amber-400" /> My Standing
               </h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase text-white/60 tracking-widest">Global Rank</p>
                     <p className="text-2xl font-black italic">--</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase text-white/60 tracking-widest">Percentile</p>
                     <p className="text-2xl font-black italic">--</p>
                  </div>
                  <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
                     Detailed View <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </section>

            <section className="fantasy-card p-6 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Top Gainers
               </h3>
               <div className="space-y-4 opacity-50 italic text-xs font-bold">
                  Updating standings...
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}