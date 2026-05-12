import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { History as HistoryIcon, Calendar } from 'lucide-react';

interface GWHistory {
  round_id: number;
  points: number;
}

export function History() {
  const { user } = useStore();
  const [history, setHistory] = useState<GWHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: team } = await supabase.from('user_teams').select('id').eq('user_id', user?.id).single();
      if (!team) return;

      const { data, error } = await supabase
        .from('team_scores')
        .select('round_id, points')
        .eq('team_id', team.id)
        .order('round_id');

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[var(--fpl-purple)] text-white px-6 py-8">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <HistoryIcon className="h-8 w-8 text-[var(--fpl-green)]" /> Performance History
          </h1>
          <p className="text-slate-300 font-medium mt-1">Review your performance across previous gameweeks.</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 animate-pulse font-bold text-[var(--fpl-purple)]">Loading History...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
               <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">No history available yet. Play a gameweek to see your results!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="fpl-card p-6 bg-slate-50">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Best GW Rank</span>
                    <span className="text-2xl font-black text-[var(--fpl-purple)]">-</span>
                 </div>
                 <div className="fpl-card p-6 bg-slate-50">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Best GW Points</span>
                    <span className="text-2xl font-black text-[var(--fpl-purple)]">{Math.max(...history.map(h => h.points))}</span>
                 </div>
                 <div className="fpl-card p-6 bg-slate-50">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Total Points</span>
                    <span className="text-2xl font-black text-[var(--fpl-purple)]">{history.reduce((sum, h) => sum + h.points, 0)}</span>
                 </div>
                 <div className="fpl-card p-6 bg-slate-50">
                    <span className="block text-[10px] font-black text-slate-400 uppercase">Overall Rank</span>
                    <span className="text-2xl font-black text-[var(--fpl-purple)]">-</span>
                 </div>
              </div>

              <div className="mt-8">
                 <h2 className="text-sm font-black text-[var(--fpl-purple)] uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Season Results</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                             <th className="py-3 px-4">GW</th>
                             <th className="py-3 px-4 text-right">Points</th>
                             <th className="py-3 px-4 text-right">Rank</th>
                             <th className="py-3 px-4 text-right">Total Pts</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {history.map((h, i) => {
                             const totalSoFar = history.slice(0, i + 1).reduce((sum, item) => sum + item.points, 0);
                             return (
                                <tr key={h.round_id} className="hover:bg-slate-50 transition-colors">
                                   <td className="py-4 px-4 font-bold text-[var(--fpl-purple)]">Gameweek {h.round_id}</td>
                                   <td className="py-4 px-4 text-right font-black text-[var(--fpl-purple)]">{h.points}</td>
                                   <td className="py-4 px-4 text-right text-slate-400">-</td>
                                   <td className="py-4 px-4 text-right font-bold text-[var(--fpl-purple)]">{totalSoFar}</td>
                                </tr>
                             );
                          })}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}