import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, Plus, Save, Trash2, Edit2, PlaySquare } from 'lucide-react';

interface Match {
  id: number;
  home_club: number;
  away_club: number;
}

interface Player {
  id: number;
  name: string;
  club_id: number;
}

interface MatchEvent {
  id: number;
  match_id: number;
  event_type: string;
  player_id: number;
  minute: number;
  related_player_id?: number;
}

const MatchEvents = () => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  const [matchId, setMatchId] = useState<number>(0);
  const [eventType, setEventType] = useState('goal');
  const [playerId, setPlayerId] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [relatedPlayerId, setRelatedPlayerId] = useState<number | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMatches();
    fetchPlayers();
    fetchClubs();
  }, []);

  useEffect(() => {
    if (matchId) fetchEvents();
  }, [matchId]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('match_events').select('*').eq('match_id', matchId).order('minute');
    if (error) console.error('Error fetching events:', error);
    else setEvents(data || []);
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('matches').select('id, home_club, away_club');
    if (error) console.error('Error fetching matches:', error);
    else {
      setMatches(data || []);
      if (data && data.length > 0) setMatchId(data[0].id);
    }
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('id, name, club_id');
    if (error) console.error('Error fetching players:', error);
    else {
      setPlayers(data || []);
    }
  };

  const fetchClubs = async () => {
    const { data, error } = await supabase.from('clubs').select('id, name');
    if (error) console.error('Error fetching clubs:', error);
    else setClubs(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { match_id: matchId, event_type: eventType, player_id: playerId, minute, related_player_id: relatedPlayerId };
    if (editingId) {
      const { error } = await supabase.from('match_events').update(eventData).eq('id', editingId);
      if (error) console.error('Error updating event:', error);
      else {
        setEditingId(null);
        resetForm();
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from('match_events').insert([eventData]);
      if (error) console.error('Error adding event:', error);
      else {
        resetForm();
        fetchEvents();
      }
    }
  };

  const resetForm = () => {
    setMinute(0);
    setRelatedPlayerId(undefined);
  };

  const handleEdit = (event: MatchEvent) => {
    setEditingId(event.id);
    setEventType(event.event_type);
    setPlayerId(event.player_id);
    setMinute(event.minute);
    setRelatedPlayerId(event.related_player_id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحدث؟')) return;
    const { error } = await supabase.from('match_events').delete().eq('id', id);
    if (error) console.error('Error deleting event:', error);
    else fetchEvents();
  };

  const currentMatch = matches.find(m => m.id === matchId);
  const filteredPlayers = players.filter(p => p.club_id === currentMatch?.home_club || p.club_id === currentMatch?.away_club);

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'goal': return 'bg-emerald-900/40 text-emerald-400';
      case 'assist': return 'bg-blue-900/40 text-blue-400';
      case 'yellow': return 'bg-yellow-900/40 text-yellow-400';
      case 'red': return 'bg-red-900/40 text-red-400';
      case 'own_goal': return 'bg-rose-900/40 text-rose-400';
      case 'penalty': return 'bg-emerald-900/40 text-emerald-400';
      case 'save': return 'bg-indigo-900/40 text-indigo-400';
      case 'penalty_save': return 'bg-purple-900/40 text-purple-400';
      case 'penalty_miss': return 'bg-orange-900/40 text-orange-400';
      case 'minutes': return 'bg-slate-900/40 text-slate-400';
      default: return 'bg-slate-900/40 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6 text-right">
      <h2 className="text-2xl font-bold flex flex-row-reverse items-center gap-2">
        <Activity className="text-indigo-500" /> إدارة أحداث المباريات
      </h2>
      
      {/* Match Selector */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-right">
        <label className="block text-sm font-medium mb-2 text-indigo-300 text-right">اختر المباراة النشطة لتسجيل الأحداث</label>
        <select 
          value={matchId} 
          onChange={(e) => setMatchId(parseInt(e.target.value))}
          className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold shadow-sm text-right"
        >
          {matches.map(match => (
            <option key={match.id} value={match.id}>
              {clubs.find(c => c.id === match.home_club)?.name} ضد {clubs.find(c => c.id === match.away_club)?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-fit text-right">
          <h3 className="font-bold text-lg mb-4 flex flex-row-reverse items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
            {editingId ? 'تعديل الحدث' : 'تسجيل حدث جديد'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-right">نوع الحدث</label>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
              >
                <option value="goal">هدف ⚽</option>
                <option value="assist">تمريرة حاسمة 👟</option>
                <option value="penalty">ركلة جزاء 🎯</option>
                <option value="own_goal">هدف عكسي 🤦‍♂️</option>
                <option value="save">تصدّي 🧤</option>
                <option value="penalty_save">تصدّي لركلة جزاء 🧤🔥</option>
                <option value="penalty_miss">إهدار ركلة جزاء ❌</option>
                <option value="minutes">دقائق اللعب ⏱️</option>
                <option value="yellow">بطاقة صفراء 🟨</option>
                <option value="red">بطاقة حمراء 🟥</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اللاعب</label>
              <select 
                value={playerId} 
                onChange={(e) => setPlayerId(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
              >
                <option value={0}>اختر اللاعب...</option>
                {filteredPlayers.map(player => (
                  <option key={player.id} value={player.id}>{player.name} ({clubs.find(c => c.id === player.club_id)?.name})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">الدقيقة</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={minute} 
                  onChange={(e) => setMinute(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-4 pl-10 text-right"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">'</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-right">اللاعب ذو الصلة (اختياري، مثل صانع الهدف)</label>
              <select 
                value={relatedPlayerId || 0} 
                onChange={(e) => setRelatedPlayerId(parseInt(e.target.value) || undefined)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-right"
              >
                <option value={0}>لا يوجد</option>
                {filteredPlayers.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>
            <div className="pt-4 flex flex-row-reverse gap-2">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex flex-row-reverse items-center justify-center gap-2 text-sm"
              >
                 {editingId ? 'تحديث الحدث' : 'تسجيل الحدث'} <Save className="w-4 h-4" />
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

        {/* Timeline List Card */}
        <div className="xl:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden text-right">
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex flex-row-reverse justify-between items-center">
            <h3 className="font-bold flex flex-row-reverse items-center gap-2"><PlaySquare className="w-4 h-4 text-indigo-400" /> الجدول الزمني للمباراة</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">{events.length} أحداث</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="p-4 font-semibold w-16 text-center">الدقيقة</th>
                  <th className="p-4 font-semibold text-right">الحدث</th>
                  <th className="p-4 font-semibold text-right">اللاعب</th>
                  <th className="p-4 font-semibold text-right">ذو صلة</th>
                  <th className="p-4 font-semibold text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-black text-indigo-300 text-center">{event.minute}'</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getEventStyle(event.event_type)}`}>
                        {event.event_type === 'goal' ? 'هدف' : event.event_type === 'assist' ? 'صناعة' : event.event_type === 'penalty' ? 'جزاء' : event.event_type === 'own_goal' ? 'هدف عكسي' : event.event_type === 'yellow' ? 'بطاقة صفراء' : event.event_type === 'red' ? 'بطاقة حمراء' : event.event_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-white text-right">{players.find(p => p.id === event.player_id)?.name}</td>
                    <td className="p-4 text-slate-400 text-right">{players.find(p => p.id === event.related_player_id)?.name || '-'}</td>
                    <td className="p-4 text-left space-x-2">
                      <button onClick={() => handleEdit(event)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1 ml-2"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(event.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>لا توجد أحداث مسجلة لهذه المباراة حتى الآن.</p>
                    </td>
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

export default MatchEvents;
