import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutGrid, Plus, Save, Trash2, Edit2 } from 'lucide-react';

interface Group {
  id: number;
  name: string;
}

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data, error } = await supabase.from('groups').select('*').order('name');
    if (error) console.error('Error fetching groups:', error);
    else setGroups(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('groups').update({ name }).eq('id', editingId);
      if (error) console.error('Error updating group:', error);
      else {
        setEditingId(null);
        setName('');
        fetchGroups();
      }
    } else {
      const { error } = await supabase.from('groups').insert([{ name }]);
      if (error) console.error('Error adding group:', error);
      else {
        setName('');
        fetchGroups();
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    const { error } = await supabase.from('groups').delete().eq('id', id);
    if (error) console.error('Error deleting group:', error);
    else fetchGroups();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <LayoutGrid className="text-indigo-500" /> Manage Tournament Groups
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
            {editingId ? 'Edit Group' : 'Add New Group'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Group Name (e.g. Group A)</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                required
              />
            </div>
            <div className="pt-2 flex gap-2">
              <button 
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Save'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setName(''); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
            <h3 className="font-bold">Groups List</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">{groups.length} Total</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="p-4 font-semibold">Group Name</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 font-medium text-white">{group.name}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => { setEditingId(group.id); setName(group.name); }} className="text-slate-400 hover:text-indigo-400 transition-colors p-1"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(group.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
                {groups.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-slate-500">No groups found.</td>
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

export default Groups;
