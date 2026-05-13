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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <div className="fantasy-card p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white px-6 py-10 md:py-16 text-right">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 justify-end">
             سجل الأداء <HistoryIcon className="h-8 w-8 text-[var(--primary)]" />
          </h1>
          <p className="text-white/60 font-bold mt-1">راجع أداءك في الجولات السابقة.</p>
        </div>

        <div className="p-6 md:p-10 bg-gradient-to-b from-[var(--card)] to-[var(--muted)]/30">
          {loading ? (
            <div className="text-center py-12 animate-pulse font-bold text-[var(--primary)]">جاري تحميل السجل...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-[var(--muted)]/50 rounded-[2rem] border-2 border-dashed border-[var(--border)]">
               <Calendar className="h-12 w-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-20" />
               <p className="text-[var(--muted-foreground)] font-black uppercase tracking-widest text-xs">لا يوجد سجل متاح حالياً. ابدأ اللعب لتظهر نتائجك هنا!</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="fantasy-card p-6 bg-[var(--card)] text-right border-r-4 border-amber-500">
                    <span className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">أفضل ترتيب جولة</span>
                    <span className="text-2xl font-black text-[var(--foreground)] italic">--</span>
                 </div>
                 <div className="fantasy-card p-6 bg-[var(--card)] text-right border-r-4 border-emerald-500">
                    <span className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">أفضل نقاط جولة</span>
                    <span className="text-2xl font-black text-[var(--foreground)] italic">{Math.max(...history.map(h => h.points))}</span>
                 </div>
                 <div className="fantasy-card p-6 bg-[var(--card)] text-right border-r-4 border-[var(--primary)]">
                    <span className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">إجمالي النقاط</span>
                    <span className="text-2xl font-black text-[var(--foreground)] italic">{history.reduce((sum, h) => sum + h.points, 0)}</span>
                 </div>
                 <div className="fantasy-card p-6 bg-[var(--card)] text-right border-r-4 border-indigo-500">
                    <span className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">الترتيب العام</span>
                    <span className="text-2xl font-black text-[var(--foreground)] italic">--</span>
                 </div>
              </div>

              <div className="mt-10">
                 <h2 className="text-sm font-black text-[var(--primary)] uppercase tracking-widest border-b border-[var(--border)] pb-4 mb-6 text-right">نتائج الموسم</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                       <thead>
                          <tr className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest border-b border-[var(--border)]">
                             <th className="py-4 px-6 text-right">الجولة</th>
                             <th className="py-4 px-6 text-center">النقاط</th>
                             <th className="py-4 px-6 text-center">الترتيب</th>
                             <th className="py-4 px-6 text-left">إجمالي النقاط</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[var(--border)]">
                          {history.map((h, i) => {
                             const totalSoFar = history.slice(0, i + 1).reduce((sum, item) => sum + item.points, 0);
                             return (
                                <tr key={h.round_id} className="hover:bg-[var(--primary)]/5 transition-colors group">
                                   <td className="py-5 px-6 font-black text-[var(--foreground)]">الجولة {h.round_id}</td>
                                   <td className="py-5 px-6 text-center font-black text-[var(--primary)] italic text-lg">{h.points}</td>
                                   <td className="py-5 px-6 text-center text-[var(--muted-foreground)] font-bold">--</td>
                                   <td className="py-5 px-6 text-left font-black text-[var(--foreground)]">{totalSoFar}</td>
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