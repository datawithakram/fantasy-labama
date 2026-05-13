import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Plus, Save, Trash2, Edit2 } from 'lucide-react';

interface Club {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  price: number;
  club_id: number;
}

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('GK');
  const [price, setPrice] = useState<number>(0);
  const [clubId, setClubId] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPlayers();
    fetchClubs();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*').order('name');
    if (error) console.error('Error fetching players:', error);
    else setPlayers(data || []);
  };

  const fetchClubs = async () => {
    const { data, error } = await supabase.from('clubs').select('id, name').order('name');
    if (error) console.error('Error fetching clubs:', error);
    else {
      setClubs(data || []);
      if (data && data.length > 0) setClubId(data[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const playerData = { name, position, price, club_id: clubId };
    if (editingId) {
      const { error } = await supabase.from('players').update(playerData).eq('id', editingId);
      if (error) console.error('Error updating player:', error);
      else {
        setEditingId(null);
        resetForm();
        fetchPlayers();
      }
    } else {
      const { error } = await supabase.from('players').insert([playerData]);
      if (error) console.error('Error adding player:', error);
      else {
        resetForm();
        fetchPlayers();
      }
    }
  };

  const resetForm = () => {
    setName('');
    setPosition('GK');
    setPrice(0);
    if (clubs.length > 0) setClubId(clubs[0].id);
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setName(player.name);
    setPosition(player.position);
    setPrice(player.price);
    setClubId(player.club_id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا اللاعب؟')) return;
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) console.error('Error deleting player:', error);
    else fetchPlayers();
  };

  return (
    <div className="p-6 space-y-6 text-right">
      <h2 className="text-2xl font-bold flex flex-row-reverse items-center gap-2">
        <Users className="text-indigo-500" /> إدارة اللاعبين
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-fit text-right">
          <h3 className="font-bold text-lg mb-4 flex flex-row-reverse items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
            {editingId ? 'تعديل اللاعب' : 'إضافة لاعب جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اسم اللاعب</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">المركز</label>
              <select 
                value={position} 
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
              >
                <option value="GK">حارس مرمى (GK)</option>
                <option value="DEF">مدافع (DEF)</option>
                <option value="MID">لاعب وسط (MID)</option>
                <option value="FWD">مهاجم (FWD)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">السعر (مليون)</label>
              <input 
                type="number" 
                step="0.1"
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">النادي</label>
              <select 
                value={clubId} 
                onChange={(e) => setClubId(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
              >
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
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
                  onClick={() => { setEditingId(null); resetForm(); }}
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
            <h3 className="font-bold">قائمة اللاعبين</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">الإجمالي {players.length}</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="p-4 font-semibold text-right">الاسم</th>
                  <th className="p-4 font-semibold text-right">المركز</th>
                  <th className="p-4 font-semibold text-right">النادي</th>
                  <th className="p-4 font-semibold text-right">السعر</th>
                  <th className="p-4 font-semibold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-medium text-right">{player.name}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                        ${player.position === 'GK' ? 'bg-yellow-900/40 text-yellow-400' : 
                          player.position === 'DEF' ? 'bg-blue-900/40 text-blue-400' : 
                          player.position === 'MID' ? 'bg-green-900/40 text-green-400' : 
                          'bg-red-900/40 text-red-400'}`}>
                        {player.position}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-right">{clubs.find(c => c.id === player.club_id)?.name || player.club_id}</td>
                    <td className="p-4 font-mono font-bold text-indigo-400 text-right">{player.price}m</td>
                    <td className="p-4 text-left space-x-2">
                      <button onClick={() => handleEdit(player)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 ml-2"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(player.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {players.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">لا يوجد لاعبون حالياً.</td>
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

export default Players;
