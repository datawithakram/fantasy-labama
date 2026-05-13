import React, { useEffect, useState } from 'react';
import { RotateCcw, AlertCircle, Calendar, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Round {
  id: number;
  name: string;
  deadline_time: string;
  is_current: boolean;
}

const GameControl = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // New Round Form
  const [newRoundName, setNewRoundName] = useState('');
  const [firstMatchKickoff, setFirstMatchKickoff] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  // Auto subs form
  const [autoSubRoundId, setAutoSubRoundId] = useState(1);

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('rounds').select('*').order('id', { ascending: true });
      if (error) {
        if (error.code !== '42P01') throw error; 
        console.warn('Rounds table might not exist yet.');
      } else {
        setRounds(data || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRound = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!firstMatchKickoff) throw new Error("Kickoff time is required");

      if (isCurrent) {
        await supabase.from('rounds').update({ is_current: false }).eq('is_current', true);
      }
      
      const kickoffDate = new Date(firstMatchKickoff);
      const deadlineDate = new Date(kickoffDate.getTime() - 30 * 60000);

      const { error } = await supabase.from('rounds').insert({
        name: newRoundName,
        deadline_time: deadlineDate.toISOString(),
        is_current: isCurrent
      });

      if (error) throw error;
      
      setMessage({ text: `Round "${newRoundName}" created successfully!`, type: 'success' });
      setNewRoundName('');
      setFirstMatchKickoff('');
      setIsCurrent(false);
      fetchRounds();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create round', type: 'error' });
    }
  };

  const handleSetCurrent = async (id: number) => {
    try {
      await supabase.from('rounds').update({ is_current: false }).eq('is_current', true);
      const { error } = await supabase.from('rounds').update({ is_current: true }).eq('id', id);
      if (error) throw error;
      fetchRounds();
      setMessage({ text: 'The active round has been updated.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleDeleteRound = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الجولة؟')) return;
    try {
      const { error } = await supabase.from('rounds').delete().eq('id', id);
      if (error) throw error;
      fetchRounds();
      setMessage({ text: 'Round deleted successfully.', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleAutoSubs = async () => {
    setMessage(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/auto-subs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round_id: autoSubRoundId })
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
      } else {
        setMessage({ text: result.error || 'Failed to process auto-subs', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Backend Engine connection failed.', type: 'error' });
    }
  };

  const handleCalculatePoints = async () => {
    setMessage(null);
    if (!window.confirm('هل أنت متأكد من حساب النقاط؟ سيقوم هذا بتحديث نتائج جميع الفرق.')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/calculate-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round_id: autoSubRoundId })
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
      } else {
        setMessage({ text: result.error || 'Failed to calculate points', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Backend Engine connection failed.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl text-right">
      <div className="text-right">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">التحكم <span className="text-indigo-400">باللعبة</span></h1>
        <p className="text-slate-400 mt-2 font-medium">إدارة الجولات، المواعيد النهائية، وعمليات المحرك الآلية.</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-xl flex flex-row-reverse items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-bold text-sm text-right">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rounds Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <div className="flex flex-row-reverse items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold text-white">المواعيد النهائية للجولات</h3>
            </div>
            
            <form onSubmit={handleCreateRound} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-slate-900/40 rounded-2xl border border-white/5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">اسم الجولة</label>
                  <input 
                    type="text" 
                    value={newRoundName} 
                    onChange={(e) => setNewRoundName(e.target.value)}
                    placeholder="مثال: الجولة 1"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-right">وقت انطلاق المباراة الأولى</label>
                  <input 
                    type="datetime-local" 
                    value={firstMatchKickoff} 
                    onChange={(e) => setFirstMatchKickoff(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-right"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-right">
                   <p className="text-[10px] text-amber-500 font-black uppercase mb-1">قاعدة الإغلاق الآلي</p>
                   <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                     {firstMatchKickoff ? 
                       `يتم الإغلاق في: ${new Date(new Date(firstMatchKickoff).getTime() - 30 * 60000).toLocaleString('ar-EG')}` : 
                       'اختر وقت الانطلاق لحساب الموعد النهائي (قبل بـ 30 دقيقة).'}
                   </p>
                </div>
                <div className="flex flex-row-reverse items-center gap-3 px-2">
                  <input 
                    type="checkbox" 
                    id="is_current"
                    checked={isCurrent} 
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_current" className="text-xs font-bold text-slate-300 cursor-pointer">تعيين كجولة نشطة</label>
                </div>
                <button 
                  type="submit"
                  className="glow-button w-full flex-row-reverse gap-2"
                >
                   إنشاء الجولة <Save className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-right">سجل الجولات</h4>
              {rounds.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/20 rounded-2xl border border-dashed border-white/5">
                   <p className="text-slate-500 text-sm italic font-medium">لا توجد جولات حالياً.</p>
                </div>
              ) : rounds.map(r => (
                <div key={r.id} className={`p-4 rounded-2xl border transition-all flex flex-row-reverse justify-between items-center group ${r.is_current ? 'bg-indigo-600/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}>
                  <div className="flex flex-row-reverse items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${r.is_current ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}></div>
                    <div className="text-right">
                      <h4 className="font-bold text-white flex flex-row-reverse items-center gap-2">
                        {r.name} 
                        {r.is_current && <span className="bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">نشطة</span>}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{new Date(r.deadline_time).toLocaleString('ar-EG')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all flex-row-reverse">
                    {!r.is_current && (
                      <button onClick={() => handleSetCurrent(r.id)} className="text-[10px] bg-white/5 hover:bg-indigo-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg font-black uppercase transition-all">
                        تفعيل
                      </button>
                    )}
                    <button onClick={() => handleDeleteRound(r.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engine Sidebar */}
        <div className="space-y-6">
          <div className="admin-card border-indigo-500/20 bg-gradient-to-br from-slate-800/40 to-indigo-950/20">
            <div className="flex flex-row-reverse items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-500/20 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <RotateCcw className="w-5 h-5 text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold text-white tracking-tight">التحكم بالمحرك</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 text-right">معرف الجولة المستهدفة</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={autoSubRoundId} 
                    onChange={(e) => setAutoSubRoundId(parseInt(e.target.value))}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl font-black text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs uppercase italic pointer-events-none">ID</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCalculatePoints}
                  className="glow-button w-full py-4 text-lg bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/40 border-emerald-500/50 flex-row-reverse gap-2"
                >
                   حساب النقاط <CheckCircle2 className="w-5 h-5 relative z-10" /> 
                </button>

                <button 
                  onClick={handleAutoSubs}
                  className="glow-button w-full py-4 text-lg flex-row-reverse gap-2"
                >
                   تشغيل التبديلات الآلية <RotateCcw className="w-5 h-5 relative z-10" /> 
                </button>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-right">
                 <div className="flex flex-row-reverse gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-400/80 leading-normal font-medium uppercase tracking-tight text-right">
                      هذه الإجراءات نهائية. قم بـ "حساب النقاط" أولاً، ثم "تشغيل التبديلات الآلية" بعد انتهاء جميع المباريات.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControl;