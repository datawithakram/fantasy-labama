import { useEffect, useState } from 'react';
import { Trophy, Shield, Users, Trash2, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface League {
  id: string;
  name: string;
  code: string;
  created_at: string;
  is_public: boolean;
}

interface User {
  id: string;
  username: string;
}

const LeagueManager = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [leagueMembers, setLeagueMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchLeagues();
    fetchUsers();
  }, []);

  const fetchLeagues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
      if (error) {
        if (error.code !== '42P01') throw error;
      } else {
        setLeagues(data || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('id, username');
      if (!error && data) setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLeagueMembers = async (leagueId: string) => {
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          user_id,
          users ( username )
        `)
        .eq('league_id', leagueId);
      if (!error && data) setLeagueMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLeague = (league: League) => {
    setSelectedLeague(league);
    loadLeagueMembers(league.id);
  };

  const togglePublicStatus = async (league: League) => {
    try {
      const { error } = await supabase.from('leagues').update({ is_public: !league.is_public }).eq('id', league.id);
      if (error) throw error;
      setMessage({ text: 'League visibility updated', type: 'success' });
      fetchLeagues();
      if (selectedLeague?.id === league.id) {
        setSelectedLeague({ ...league, is_public: !league.is_public });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleAddAllUsers = async () => {
    if (!selectedLeague) return;
    try {
      const inserts = users
        .filter(u => !leagueMembers.some(m => m.user_id === u.id))
        .map(u => ({ league_id: selectedLeague.id, user_id: u.id }));
      
      if (inserts.length === 0) {
        setMessage({ text: 'All users are already in this league', type: 'success' });
        return;
      }

      const { error } = await supabase.from('league_members').insert(inserts);
      if (error) throw error;
      
      setMessage({ text: `Added ${inserts.length} users to league`, type: 'success' });
      loadLeagueMembers(selectedLeague.id);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleDeleteLeague = async (id: string) => {
    if (!confirm('Are you sure you want to delete this league?')) return;
    try {
      const { error } = await supabase.from('leagues').delete().eq('id', id);
      if (error) throw error;
      setMessage({ text: 'League deleted', type: 'success' });
      if (selectedLeague?.id === id) setSelectedLeague(null);
      fetchLeagues();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-indigo-500" /> League Management
      </h2>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 mb-6 ${message.type === 'success' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-900/20 text-red-400 border border-red-500/20'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* League List */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
            <h3 className="font-bold">All Leagues</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">{leagues.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Visibility</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leagues.map(league => (
                  <tr key={league.id} className={`hover:bg-slate-700/50 transition-colors ${selectedLeague?.id === league.id ? 'bg-indigo-900/20' : ''}`}>
                    <td className="p-4 font-medium flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-slate-400" /> {league.name}
                    </td>
                    <td className="p-4 font-mono text-indigo-400">{league.code}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => togglePublicStatus(league)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-bold ${league.is_public ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400'}`}
                      >
                        {league.is_public ? <><Unlock className="w-3 h-3" /> Public</> : <><Lock className="w-3 h-3" /> Private</>}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleSelectLeague(league)} className="text-slate-400 hover:text-indigo-400 transition-colors">Manage</button>
                      <button onClick={() => handleDeleteLeague(league.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {leagues.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No leagues exist.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected League Detail */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          {selectedLeague ? (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-400 mb-1">{selectedLeague.name}</h3>
                <p className="text-sm text-slate-400 font-mono">Code: {selectedLeague.code}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-900 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">Total Members</h4>
                    <p className="text-2xl font-black">{leagueMembers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-slate-600" />
                </div>

                <button 
                  onClick={handleAddAllUsers}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" /> Add All App Users
                </button>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h4 className="font-bold text-sm mb-3">Members List</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {leagueMembers.map(m => (
                    <div key={m.user_id} className="bg-slate-900 p-2 rounded text-sm flex items-center gap-2 border border-slate-700">
                      <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {m.users?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="truncate">{m.users?.username || 'Unknown User'}</span>
                    </div>
                  ))}
                  {leagueMembers.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-2">No members yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
              <Trophy className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a league to manage members</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeagueManager;