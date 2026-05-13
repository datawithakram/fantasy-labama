import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Trophy, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamStats {
  budget: number;
  total_points?: number;
  players_count: number;
  team_id?: string;
}

export function Dashboard() {
  const { user } = useStore();
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);
      try {
        const { data: team, error: teamError } = await supabase
          .from('user_teams')
          .select('id, budget')
          .eq('user_id', user.id)
          .single();

        if (teamError && teamError.code !== 'PGRST116') throw teamError;

        if (team) {
          const [{ count: playersCount }, { data: scores }] = await Promise.all([
            supabase.from('team_players').select('*', { count: 'exact', head: true }).eq('team_id', team.id),
            supabase.from('team_scores').select('points').eq('team_id', team.id)
          ]);

          const totalPoints = scores?.reduce((sum, s) => sum + (s.points || 0), 0) || 0;

          setStats({
            budget: team.budget,
            total_points: totalPoints,
            players_count: playersCount || 0,
            team_id: team.id
          });
        } else {
          setStats({ budget: 100, players_count: 0, total_points: 0 });
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <TrendingUp className="w-12 h-12 text-[var(--primary)] animate-pulse" />
        <p className="font-black italic uppercase tracking-tighter text-[var(--muted-foreground)] text-center">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0 text-right">
      {/* Welcome Banner */}
      <div className="fantasy-card p-6 md:p-8 flex flex-col md:flex-row-reverse justify-between items-center gap-6 bg-gradient-to-br from-[var(--card)] to-[var(--muted)] border-r-8 border-[var(--primary)]">
        <div className="flex flex-row-reverse items-center gap-4">
          <div className="bg-[var(--primary)] p-3 rounded-2xl text-white shadow-lg shadow-[var(--primary)]/30">
            <Trophy className="h-10 w-10" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] uppercase tracking-tighter italic">لوحة تحكم <span className="text-[var(--primary)]">لبامة</span></h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-widest mt-1">الجولة 1 - الموعد النهائي: السبت 16 أغسطس 11:00</p>
          </div>
        </div>
        <Link 
          to="/build"
          className="fantasy-button bg-[var(--primary)] text-white px-8 py-4 flex flex-row-reverse items-center gap-2 whitespace-nowrap group shadow-xl shadow-[var(--primary)]/20"
        >
           {stats?.players_count === 15 ? 'عرض فريقي' : 'اختر تشكيلتك'}
           <ArrowRight className="h-5 w-5 group-hover:-translate-x-1 transition-transform rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Points & Status */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="fantasy-card p-6 flex flex-col justify-between h-32 text-right">
              <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">إجمالي النقاط</span>
              <span className="text-4xl font-black italic text-[var(--primary)]">{stats?.total_points || 0}</span>
            </div>
            <div className="fantasy-card p-6 flex flex-col justify-between h-32 text-right">
              <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">متوسط النقاط</span>
              <span className="text-4xl font-black italic text-[var(--foreground)]">0</span>
            </div>
            <div className="fantasy-card p-6 flex flex-col justify-between h-32 text-right">
              <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">أعلى نقاط</span>
              <span className="text-4xl font-black italic text-[var(--foreground)]">0</span>
            </div>
          </div>

          <div className="fantasy-card overflow-hidden text-right border-none shadow-2xl bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-row-reverse justify-between items-center">
              <h2 className="font-black italic uppercase tracking-tighter text-sm">حالة الجولة 1</h2>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="p-10 text-center">
              <div className="mb-6 inline-flex bg-[var(--muted)] p-6 rounded-[2rem] text-[var(--muted-foreground)] shadow-inner">
                <Calendar className="h-12 w-12" />
              </div>
              <p className="text-2xl font-black italic text-[var(--foreground)] mb-2 uppercase tracking-tighter">الموسم لم يبدأ بعد!</p>
              <p className="text-[var(--muted-foreground)] font-medium max-w-sm mx-auto text-sm leading-relaxed">تأكد من جاهزية فريقك قبل صافرة البداية الأولى. يمكنك إجراء انتقالات غير محدودة حتى الموعد النهائي الأول.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 md:space-y-8">
          <div className="fantasy-card p-0 overflow-hidden text-right">
            <div className="bg-[var(--muted)] px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-black italic uppercase tracking-widest text-[10px] text-[var(--muted-foreground)]">دورياتي</h2>
            </div>
            <div className="p-0">
              <div className="px-6 py-5 border-b border-[var(--border)] hover:bg-[var(--primary)]/5 transition-colors cursor-pointer group">
                <div className="flex flex-row-reverse justify-between items-center">
                  <span className="text-sm font-black text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">الدوري العالمي</span>
                  <span className="text-xs font-black bg-[var(--muted)] px-3 py-1 rounded-lg text-[var(--muted-foreground)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-sm">-</span>
                </div>
              </div>
              <div className="p-8 text-center">
                <p className="text-sm text-[var(--muted-foreground)] font-bold mb-4">أنت لست مشتركاً في أي دوريات خاصة حالياً.</p>
                <Link to="/leagues" className="text-xs font-black text-[var(--primary)] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">إنشاء أو انضمام لدوري</Link>
              </div>
            </div>
          </div>

          <div className="fantasy-card bg-slate-900 text-white p-8 border-none overflow-hidden relative shadow-2xl group text-right">
             <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-3xl -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
             <h2 className="font-black text-2xl mb-3 uppercase italic tracking-tighter relative z-10">انضم لمجتمع الفانتزي</h2>
             <p className="text-white/60 text-sm font-medium mb-6 relative z-10 leading-relaxed">تنافس مع آلاف المدربين حول العالم واربح جوائز حصرية.</p>
             <Link to="/leagues" className="block text-center bg-[var(--primary)] text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">انضم الآن</Link>
          </div>
        </div>
      </div>
    </div>
  );
}