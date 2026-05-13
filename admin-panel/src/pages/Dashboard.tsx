import { Link } from 'react-router-dom';
import { Users, Shield, Calendar, Activity, LayoutGrid, Settings, ArrowRight, TrendingUp, UserCheck, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const cards = [
    { title: 'التحكم باللعبة', icon: Settings, link: '/control', description: 'معالجة التبديلات التلقائية، تحديث الجولات، وإدارة حالة اللعبة.', color: 'text-rose-400' },
    { title: 'المجموعات', icon: LayoutGrid, link: '/groups', description: 'تنظيم مجموعات البطولة وتوزيع الفرق.', color: 'text-amber-400' },
    { title: 'الأندية', icon: Shield, link: '/clubs', description: 'إدارة بيانات الأندية، الشعارات، ومعلومات الملاعب.', color: 'text-emerald-400' },
    { title: 'اللاعبين', icon: Users, link: '/players', description: 'تحديث أسعار اللاعبين، مراكزهم، وحالة التوفر.', color: 'text-sky-400' },
    { title: 'المباريات', icon: Calendar, link: '/matches', description: 'جدولة المباريات القادمة والنتائج المباشرة.', color: 'text-indigo-400' },
    { title: 'أحداث المباريات', icon: Activity, link: '/events', description: 'تسجيل الأحداث المباشرة، البطاقات، والأهداف.', color: 'text-fuchsia-400' },
  ];

  const stats = [
    { label: 'إجمالي اللاعبين', value: '452', icon: Users, trend: '+12%' },
    { label: 'الدوريات النشطة', value: '1,284', icon: TrendingUp, trend: '+5.4%' },
    { label: 'المستخدمين الآن', value: '8,921', icon: UserCheck, trend: '+22%' },
    { label: 'القيمة السوقية', value: '£4.2B', icon: DollarSign, trend: '+1.2%' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">نظرة عامة على <span className="text-indigo-500">النظام</span></h1>
          <p className="text-slate-400 mt-2 font-medium">مرحباً بك مجدداً أيها المدير. إليك ما يحدث في فانتزي لابطاما اليوم.</p>
        </div>
        <button className="glow-button">
          توليد تقرير الجولة
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card !p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                {stat.trend} <span className="text-slate-600 font-normal italic">مقارنة بالأسبوع الماضي</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center border border-white/5">
              <stat.icon className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Actions Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5"></div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">وحدات الإدارة</h2>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link 
              key={card.title} 
              to={card.link}
              className="admin-card group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-slate-900/50 border border-white/5 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:-translate-x-1 transition-all rotate-180" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">جدول نشط</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-10 flex justify-center opacity-20 grayscale transition-all hover:grayscale-0 hover:opacity-100">
         <p className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">بدعم من محرك لابطاما الأساسي v2.4.0</p>
      </div>
    </div>
  );
};

export default Dashboard;


