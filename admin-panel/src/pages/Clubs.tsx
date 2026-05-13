import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Plus, Save, Trash2, Edit2 } from 'lucide-react';

interface Club {
  id: number;
  name: string;
  country: string;
}

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const { data, error } = await supabase.from('clubs').select('*').order('name');
    if (error) console.error('Error fetching clubs:', error);
    else setClubs(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('clubs').update({ name, country }).eq('id', editingId);
      if (error) console.error('Error updating club:', error);
      else {
        setEditingId(null);
        setName('');
        setCountry('');
        fetchClubs();
      }
    } else {
      const { error } = await supabase.from('clubs').insert([{ name, country }]);
      if (error) console.error('Error adding club:', error);
      else {
        setName('');
        setCountry('');
        fetchClubs();
      }
    }
  };

  const handleEdit = (club: Club) => {
    setEditingId(club.id);
    setName(club.name);
    setCountry(club.country);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا النادي؟')) return;
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) console.error('Error deleting club:', error);
    else fetchClubs();
  };

  return (
    <div className="p-6 space-y-6 text-right">
      <h2 className="text-2xl font-bold flex flex-row-reverse items-center gap-2">
        <Shield className="text-indigo-500" /> إدارة الأندية
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-fit text-right">
          <h3 className="font-bold text-lg mb-4 flex flex-row-reverse items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
            {editingId ? 'تعديل النادي' : 'إضافة نادي جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اسم النادي</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">الدولة</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
                required
              />
            </div>
            <div className="pt-2 flex flex-row-reverse gap-2">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex flex-row-reverse items-center justify-center gap-2 text-sm"
              >
                 {editingId ? 'تحديث' : 'حفظ'} <Save className="w-4 h-4" />
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setName(''); setCountry(''); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden text-right">
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex flex-row-reverse justify-between items-center">
            <h3 className="font-bold">قائمة الأندية</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">الإجمالي {clubs.length}</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="p-4 font-semibold text-right">الاسم</th>
                  <th className="p-4 font-semibold text-right">الدولة</th>
                  <th className="p-4 font-semibold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {clubs.map((club) => (
                  <tr key={club.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-medium flex flex-row-reverse items-center gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-600">
                        {club.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-right">{club.name}</span>
                    </td>
                    <td className="p-4 text-slate-300 text-right">{club.country}</td>
                    <td className="p-4 text-left space-x-2">
                      <button onClick={() => handleEdit(club)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 ml-2"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(club.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {clubs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">لا توجد أندية حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
