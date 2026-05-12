import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Plus, Save, Trash2, Edit2, PlayCircle, CheckCircle2, Clock } from 'lucide-react';

interface Club {
  id: number;
  name: string;
}

interface Match {
  id: number;
  home_club: number;
  away_club: number;
  round: string;
  kickoff: string;
  status: string;
  home_score: number;
  away_score: number;
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [homeClub, setHomeClub] = useState<number>(0);
  const [awayClub, setAwayClub] = useState<number>(0);
  const [round, setRound] = useState('GROUP');
  const [kickoff, setKickoff] = useState('');
  const [status, setStatus] = useState('not_started');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMatches();
    fetchClubs();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('matches').select('*').order('kickoff');
    if (error) console.error('Error fetching matches:', error);
    else setMatches(data || []);
  };

  const fetchClubs = async () => {
    const { data, error } = await supabase.from('clubs').select('id, name').order('name');
    if (error) console.error('Error fetching clubs:', error);
    else {
      setClubs(data || []);
      if (data && data.length > 1) {
        setHomeClub(data[0].id);
        setAwayClub(data[1].id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchData = { 
      home_club: homeClub, 
      away_club: awayClub, 
      round, 
      kickoff, 
      status, 
      home_score: homeScore, 
      away_score: awayScore 
    };
    if (editingId) {
      const { error } = await supabase.from('matches').update(matchData).eq('id', editingId);
      if (error) console.error('Error updating match:', error);
      else {
        setEditingId(null);
        resetForm();
        fetchMatches();
      }
    } else {
      const { error } = await supabase.from('matches').insert([matchData]);
      if (error) console.error('Error adding match:', error);
      else {
        resetForm();
        fetchMatches();
      }
    }
  };

  const resetForm = () => {
    setRound('GROUP');
    setKickoff('');
    setStatus('not_started');
    setHomeScore(0);
    setAwayScore(0);
  };

  const handleEdit = (match: Match) => {
    setEditingId(match.id);
    setHomeClub(match.home_club);
    setAwayClub(match.away_club);
    setRound(match.round);
    setKickoff(new Date(match.kickoff).toISOString().slice(0, 16));
    setStatus(match.status);
    setHomeScore(match.home_score);
    setAwayScore(match.away_score);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) console.error('Error deleting match:', error);
    else fetchMatches();
  };

  const getStatusIcon = (st: string) => {
    if (st === 'live') return <PlayCircle className="w-3 h-3 text-emerald-400" />;
    if (st === 'finished') return <CheckCircle2 className="w-3 h-3 text-slate-400" />;
    return <Clock className="w-3 h-3 text-amber-400" />;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="text-indigo-500" /> Manage Matches
      </h2>
      
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
          {editingId ? 'Edit Match' : 'Schedule New Match'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Home Club</label>
            <select 
              value={homeClub} 
              onChange={(e) => setHomeClub(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Away Club</label>
            <select 
              value={awayClub} 
              onChange={(e) => setAwayClub(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Round / Stage</label>
            <select 
              value={round} 
              onChange={(e) => setRound(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="GROUP">Group Stage</option>
              <option value="R16">Round of 16</option>
              <option value="QF">Quarter Finals</option>
              <option value="SF">Semi Finals</option>
              <option value="FINAL">Final</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kickoff Time</label>
            <input 
              type="datetime-local" 
              value={kickoff} 
              onChange={(e) => setKickoff(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Match Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="not_started">Not Started</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Home Score</label>
              <input 
                type="number" 
                value={homeScore} 
                onChange={(e) => setHomeScore(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Away Score</label>
              <input 
                type="number" 
                value={awayScore} 
                onChange={(e) => setAwayScore(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-700">
            {editingId && (
              <button 
                type="button"
                onClick={() => { setEditingId(null); resetForm(); }}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded transition-colors text-sm"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" /> {editingId ? 'Update Match' : 'Save Match'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Match Fixture</th>
                <th className="p-4 font-semibold">Round</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Score</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 whitespace-nowrap text-slate-300 font-mono text-xs">
                    {new Date(match.kickoff).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="p-4 font-bold">
                    <span className="text-white">{clubs.find(c => c.id === match.home_club)?.name}</span>
                    <span className="mx-2 text-slate-500 font-normal">vs</span>
                    <span className="text-white">{clubs.find(c => c.id === match.away_club)?.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-indigo-900/40 text-indigo-400 px-2 py-1 rounded text-[10px] font-bold">
                      {match.round}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-300">
                      {getStatusIcon(match.status)}
                      {match.status.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-block bg-slate-900 px-3 py-1 rounded border border-slate-700 font-mono font-bold text-lg">
                      {match.home_score} - {match.away_score}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(match)} className="text-slate-400 hover:text-indigo-400 transition-colors p-1"><Edit2 className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(match.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No matches scheduled yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Matches;