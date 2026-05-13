import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Trophy, Plus, Users, ChevronRight, Hash, Globe, LogIn, CheckCircle2, Shield, Zap, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface League {
  id: string;
  name: string;
  code: string;
  created_at: string;
  is_public: boolean;
}

export function Leagues() {
  const { user } = useStore();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [publicLeagues, setPublicLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [isNewLeaguePublic, setIsNewLeaguePublic] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'public' | 'create' | 'join'>('my');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [totalLeagues, setTotalLeagues] = useState(0);

  useEffect(() => {
    if (user) {
      if (activeTab === 'my') fetchMyLeagues();
      if (activeTab === 'public') fetchPublicLeagues();
      fetchGlobalStats();
    }
  }, [user, activeTab]);

  const fetchGlobalStats = async () => {
    try {
      const { count, error } = await supabase
        .from('leagues')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      setTotalLeagues(count || 0);
    } catch (err) {
      console.error('Error fetching global league stats:', err);
    }
  };

  const fetchMyLeagues = async () => {
    setLoading(true);
    console.log('[Leagues] Fetching leagues for user:', user?.id);
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          leagues (id, name, code, created_at, is_public)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      const mapped = data?.map((d: any) => d.leagues) || [];
      console.log('[Leagues] User leagues loaded:', mapped.length);
      setLeagues(mapped);
    } catch (err) {
      console.error('[Leagues] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicLeagues = async () => {
    setLoading(true);
    console.log('[Leagues] Fetching public explorer data...');
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code !== '42703') throw error;
      } else {
        console.log('[Leagues] Public leagues found:', data?.length);
        setPublicLeagues(data || []);
      }
    } catch (err) {
      console.error('[Leagues] Public fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeagueName || !user) return;
    
    console.log('[Leagues] Initiating league creation:', { name: newLeagueName, public: isNewLeaguePublic });
    
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({ name: newLeagueName, code, created_by: user.id, is_public: isNewLeaguePublic })
        .select()
        .single();

      if (leagueError) throw leagueError;
      console.log('[Leagues] League created successfully:', league.id);

      const { error: memberError } = await supabase
        .from('league_members')
        .insert({ league_id: league.id, user_id: user.id });

      if (memberError) throw memberError;
      console.log('[Leagues] User added as owner to league');

      setMessage({ text: `تم إنشاء الدوري "${newLeagueName}" بنجاح! ${!isNewLeaguePublic ? 'كود الانضمام: ' + code : ''}`, type: 'success' });
      setNewLeagueName('');
      setIsNewLeaguePublic(false);
      setActiveTab('my');
      fetchMyLeagues();
    } catch (err: any) {
      console.error('[Leagues] Creation failed:', err);
      setMessage({ text: `فشل إنشاء الدوري: ${err.message}`, type: 'error' });
    }
  };

  const joinLeague = async (leagueId: string, leagueName: string) => {
    if (!user) return;
    console.log('[Leagues] Attempting to join league:', { id: leagueId, name: leagueName });
    
    try {
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({ league_id: leagueId, user_id: user.id });

      if (memberError) {
        if (memberError.code === '23505') throw new Error('أنت بالفعل عضو في هذا الدوري.');
        throw memberError;
      }

      console.log('[Leagues] Successfully joined league');
      setMessage({ text: `تم الانضمام إلى ${leagueName} بنجاح!`, type: 'success' });
      setActiveTab('my');
      fetchMyLeagues();
    } catch (err: any) {
      console.error('[Leagues] Join failed:', err);
      setMessage({ text: err.message || 'فشل في الانضمام للدوري.', type: 'error' });
    }
  };

  const handleJoinPrivateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !user) return;
    console.log('[Leagues] Validating private code:', joinCode);
    
    try {
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .select('id, name')
        .eq('code', joinCode.toUpperCase())
        .single();

      if (leagueError) {
         console.warn('[Leagues] Invalid access code provided');
         throw new Error('كود الوصول غير صحيح أو منتهي الصلاحية.');
      }
      
      console.log('[Leagues] Code valid, joining:', league.name);
      await joinLeague(league.id, league.name);
      setJoinCode('');
    } catch (err: any) {
      console.error('[Leagues] Private join error:', err);
      setMessage({ text: err.message || 'فشل في الانضمام للدوري.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
         <div className="text-right w-full lg:w-auto">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">الدوريات <span className="text-[var(--primary)]">والكؤوس</span></h1>
            <p className="text-[var(--muted-foreground)] font-bold">تنافس مع مدربين من جميع أنحاء العالم.</p>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('join')}
              className="fantasy-button bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] px-6"
            >
              انضم لدوري خاص
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className="fantasy-button bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 px-8 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> إنشاء دوري
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[var(--muted)] p-1.5 rounded-2xl w-fit border border-[var(--border)] mr-auto ml-auto md:mr-0">
        {(['my', 'public'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab 
                ? "bg-[var(--card)] text-[var(--primary)] shadow-sm border border-[var(--border)]" 
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {tab === 'my' ? 'دورياتي' : 'استكشاف الدوريات'}
          </button>
        ))}
      </div>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl flex items-center gap-4 font-bold border-2 animate-in zoom-in duration-300 text-right",
          message.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          {message.type === 'error' ? <Zap className="w-6 h-6 text-rose-500" /> : <Trophy className="w-6 h-6 text-emerald-500" />}
          <p className="text-sm uppercase tracking-tight">{message.text}</p>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'my' && (
            <div className="space-y-4">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                    <Activity className="w-10 h-10 animate-spin" />
                    <p className="font-black uppercase text-xs tracking-widest text-center">جاري تحميل دورياتك...</p>
                 </div>
               ) : leagues.length === 0 ? (
                 <div className="fantasy-card p-12 flex flex-col items-center justify-center text-center gap-6 border-dashed bg-transparent">
                    <div className="p-6 bg-[var(--muted)] rounded-full text-[var(--muted-foreground)]"><Users className="w-12 h-12" /></div>
                    <div>
                       <h3 className="text-xl font-black italic uppercase tracking-tighter">لم تنضم لأي دوري بعد</h3>
                       <p className="text-[var(--muted-foreground)] text-sm font-bold max-w-xs mx-auto mt-2 text-center">لم تنضم لأي دوري بعد. لماذا لا تستكشف الدوريات العامة أو تنشئ دوريك الخاص؟</p>
                    </div>
                    <button onClick={() => setActiveTab('public')} className="fantasy-button bg-[var(--primary)] text-white px-10">استكشف الدوريات</button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leagues.map((league) => (
                      <div key={league.id} className="fantasy-card p-6 group cursor-pointer hover:border-[var(--primary)] transition-all flex flex-col justify-between min-h-[180px]">
                         <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                               <Trophy className="w-6 h-6" />
                            </div>
                            {league.is_public ? (
                               <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-emerald-500/20"><Globe className="w-2.5 h-2.5" /> عام</span>
                            ) : (
                               <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border border-amber-500/20"><Shield className="w-2.5 h-2.5" /> خاص</span>
                            )}
                         </div>
                         <div className="mt-4 text-right">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter truncate">{league.name}</h3>
                            <p className="text-[var(--muted-foreground)] text-[10px] font-black uppercase tracking-widest mt-1">المعرف: #{league.id.substring(0,6).toUpperCase()}</p>
                         </div>
                         <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                            {!league.is_public && <div className="text-[10px] font-black text-indigo-500 uppercase">كود الانضمام: {league.code}</div>}
                            <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:-translate-x-1 transition-all rotate-180" />
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'public' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-right w-full">استكشاف <span className="text-emerald-500">الدوريات العامة</span></h2>
                 <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                 {publicLeagues.map((league) => {
                    const isMember = leagues.some(l => l.id === league.id);
                    return (
                       <div key={league.id} className="fantasy-card p-6 flex flex-col justify-between min-h-[160px] border-emerald-500/10">
                          <div className="text-right">
                             <h4 className="text-lg font-black italic uppercase tracking-tighter">{league.name}</h4>
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-2 justify-end"><Globe className="w-3 h-3" /> التسجيل مفتوح</p>
                          </div>
                          <div className="mt-6">
                             {isMember ? (
                                <button className="w-full py-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20 cursor-default flex items-center justify-center gap-2">
                                   <CheckCircle2 className="w-4 h-4" /> انضممت بالفعل
                                </button>
                             ) : (
                                <button onClick={() => joinLeague(league.id, league.name)} className="w-full fantasy-button bg-[var(--primary)] text-white text-xs py-3 flex items-center justify-center gap-2">
                                   <LogIn className="w-4 h-4" /> انضم الآن
                                </button>
                             )}
                          </div>
                       </div>
                    )
                 })}
              </div>
            </div>
          )}

          {(activeTab === 'create' || activeTab === 'join') && (
             <div className="fantasy-card p-10 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                {activeTab === 'create' ? (
                   <form onSubmit={handleCreateLeague} className="space-y-8">
                      <div className="text-center">
                         <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] mx-auto mb-4">
                            <Plus className="w-8 h-8" />
                         </div>
                         <h2 className="text-2xl font-black italic uppercase tracking-tighter">إنشاء دوري جديد</h2>
                         <p className="text-[var(--muted-foreground)] font-bold text-sm mt-1 text-center">ابدأ منافسة جديدة بقوانين مخصصة.</p>
                      </div>
                      <div className="space-y-6 text-right">
                         <div>
                            <label className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-2 text-right">اسم الدوري</label>
                            <input 
                              type="text" 
                              value={newLeagueName}
                              onChange={(e) => setNewLeagueName(e.target.value)}
                              placeholder="مثال: دوري النخبة"
                              className="w-full bg-[var(--muted)] border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] transition-all text-right"
                              required
                            />
                         </div>
                         <div className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)] justify-end">
                            <label htmlFor="is_public_new" className="text-xs font-black uppercase tracking-tight text-[var(--foreground)] order-1">اجعل هذا الدوري عاماً للجميع</label>
                            <input 
                               type="checkbox" 
                               id="is_public_new"
                               checked={isNewLeaguePublic}
                               onChange={(e) => setIsNewLeaguePublic(e.target.checked)}
                               className="w-5 h-5 rounded-lg border-none bg-white text-[var(--primary)] focus:ring-[var(--primary)] order-2"
                            />
                         </div>
                      </div>
                      <button type="submit" className="w-full fantasy-button bg-[var(--primary)] text-white py-4 shadow-xl shadow-[var(--primary)]/20">تأكيد الإنشاء</button>
                   </form>
                ) : (
                   <form onSubmit={handleJoinPrivateLeague} className="space-y-8">
                      <div className="text-center">
                         <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4">
                            <Hash className="w-8 h-8" />
                         </div>
                         <h2 className="text-2xl font-black italic uppercase tracking-tighter">الانضمام لدوري خاص</h2>
                         <p className="text-[var(--muted-foreground)] font-bold text-sm mt-1 text-center">أدخل الكود السري للوصول للدوري.</p>
                      </div>
                      <div className="space-y-6 text-right">
                         <div>
                            <label className="block text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-2 text-right">كود الوصول للدوري</label>
                            <input 
                              type="text" 
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value)}
                              placeholder="مثال: ALPHA99"
                              className="w-full bg-[var(--muted)] border-none rounded-xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] transition-all uppercase text-right"
                              required
                            />
                         </div>
                      </div>
                      <button type="submit" className="w-full fantasy-button bg-indigo-600 text-white py-4 shadow-xl shadow-indigo-600/20">تحقق وانضم الآن</button>
                   </form>
                )}
                <button onClick={() => setActiveTab('my')} className="w-full mt-6 text-xs font-black uppercase text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-center">العودة للخلف</button>
             </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <section className="fantasy-card p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none shadow-xl text-right">
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4 flex items-center gap-2 justify-end">
                 معلومات الموسم <Zap className="w-5 h-5 text-amber-400" />
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold text-white/60">
                    <span className="text-white">{totalLeagues.toLocaleString()}</span>
                    <span>الدوريات النشطة</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold text-white/60">
                    <span className="text-white">#--</span>
                    <span>الترتيب العالمي</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 text-right">
                    <p className="text-[10px] font-medium leading-relaxed opacity-80">
                       يتم تحديث الدوريات بعد كل مباراة. تأكد من حفظ فريقك قبل الموعد النهائي لتُحسب النقاط في دورياتك.
                    </p>
                 </div>
              </div>
           </section>

           <section className="fantasy-card p-6 space-y-4 border-dashed bg-transparent text-right">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">أبرز الدوريات العالمية</h4>
              <div className="space-y-4">
                 {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 justify-end">
                       <div className="text-right">
                          <p className="text-xs font-bold truncate max-w-[150px]">كأس العالم للنخبة {i}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">2.4k عضو</p>
                       </div>
                       <div className="w-10 h-10 bg-[var(--muted)] rounded-xl flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}