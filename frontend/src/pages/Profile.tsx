import { useStore } from '../store/useStore';
import { User, Mail, Shield, Settings, LogOut, Bell, ChevronRight, HelpCircle, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, signOut } = useStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log('[Profile] Initiating sign out...');
    await signOut();
    console.log('[Profile] Sign out complete, redirecting to /auth');
    navigate('/auth');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <div className="fantasy-card p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
          
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-[var(--primary)] flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-2xl shadow-[var(--primary)]/40 relative z-10 border-4 border-white/10">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="text-center md:text-right relative z-10">
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2">ملف <span className="text-[var(--primary)]">المدرب</span></h1>
            <p className="text-white/60 font-bold tracking-widest text-[10px] uppercase">{user?.email}</p>
          </div>
        </div>

        <div className="p-6 md:p-10 bg-gradient-to-b from-[var(--card)] to-[var(--muted)]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                 البيانات الشخصية <UserCircle className="w-4 h-4" />
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)] group hover:border-[var(--primary)]/30 transition-all justify-end">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">البريد الإلكتروني</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{user?.email}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-[var(--muted-foreground)]"><Mail className="h-5 w-5" /></div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[var(--muted)]/50 rounded-2xl border border-[var(--border)] group hover:border-[var(--primary)]/30 transition-all justify-end">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">اسم المستخدم</p>
                    <p className="text-sm font-bold text-[var(--foreground)]">{user?.email?.split('@')[0]}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-[var(--muted-foreground)]"><User className="h-5 w-5" /></div>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                 الإدارة <Settings className="w-4 h-4" />
              </h2>
              <div className="space-y-3">
                 {[
                    { icon: Bell, label: 'إعدادات الإشعارات' },
                    { icon: Shield, label: 'الأمان والخصوصية' },
                    { icon: HelpCircle, label: 'المساعدة والدعم' }
                 ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-[var(--card)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm border border-[var(--border)] group text-right">
                       <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 group-hover:-translate-x-1 transition-all rotate-180" />
                       <div className="flex items-center gap-4">
                          <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                          <div className="p-2 bg-[var(--muted)] rounded-lg group-hover:bg-white/10 transition-colors"><item.icon className="h-5 w-5" /></div>
                       </div>
                    </button>
                 ))}
                 
                 <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-5 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10 hover:border-rose-500 mt-6 shadow-lg shadow-rose-500/5 group text-right"
                >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <ChevronRight className="h-4 w-4 rotate-180" />
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-black uppercase tracking-widest">تسجيل الخروج</span>
                       <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-white/10 transition-colors"><LogOut className="h-5 w-5" /></div>
                    </div>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fantasy-card bg-slate-900 text-white p-6 md:p-8 border-none overflow-hidden relative shadow-2xl text-right">
         <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-3xl -ml-16 -mt-16"></div>
         <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6 relative z-10">
            <div>
               <h3 className="font-black italic uppercase text-xl mb-1 flex items-center gap-2 justify-end">
                  دعم المجتمع <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
               </h3>
               <p className="text-white/60 text-xs font-bold text-right">هل تواجه مشكلة؟ فريقنا التقني جاهز لمساعدتك.</p>
            </div>
            <button className="w-full md:w-auto bg-[var(--primary)] text-white font-black py-4 px-10 rounded-xl uppercase text-xs shadow-xl shadow-[var(--primary)]/20 hover:scale-105 transition-all text-center">أرسل طلب دعم</button>
         </div>
      </div>
    </div>
  );
}