import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTeamStore, type TeamPlayer, type Position } from '../store/teamStore';
import { useStore } from '../store/useStore';
import { Search, X, UserPlus, Plus, Save, TrendingUp, DollarSign, Users as UsersIcon, Shield, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { AlertModal, type AlertType } from '../components/Alerts';
import { PlayerPickerModal } from '../components/PlayerPickerModal';
import { PlayerInfoModal } from '../components/PlayerInfoModal';

interface Club {
  id: number;
  name: string;
}

export function TeamBuilder() {
  const { user } = useStore();
  const { selectedPlayers, budget, addPlayer, removePlayer, toggleChip, setCaptain, setInitialTeam } = useTeamStore();
  const [players, setPlayers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<Record<number, Club>>({});
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  const [alertState, setAlertState] = useState<{ isOpen: boolean; type: AlertType; title: string; message: string }>({
    isOpen: false,
    type: 'hint',
    title: '',
    message: ''
  });

  const [infoState, setInfoState] = useState<{ isOpen: boolean; player: any | null }>({
    isOpen: false,
    player: null
  });
  const [pickerState, setPickerState] = useState<{ isOpen: boolean; position: Position | 'ALL' }>({
    isOpen: false,
    position: 'ALL'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fetchPlayers = Promise.resolve(supabase.from('players').select('*')).then(res => res.data);
        const fetchClubs = Promise.resolve(supabase.from('clubs').select('*')).then(res => res.data);
        const fetchRound = Promise.resolve(supabase.from('rounds').select('*').eq('is_current', true).maybeSingle()).then(res => res.data).catch(() => null);
        const fetchUserTeam = user ? Promise.resolve(supabase.from('user_teams').select('id, budget').eq('user_id', user.id).maybeSingle()).then(res => res.data).catch(() => null) : Promise.resolve(null);

        const [playersData, clubsData, roundData, userTeam] = await Promise.all([
          fetchPlayers,
          fetchClubs,
          fetchRound,
          fetchUserTeam
        ]);

        if (playersData) setPlayers(playersData);
        if (clubsData) {
          const clubMap = (clubsData as any[]).reduce((acc, club) => {
            acc[club.id] = club;
            return acc;
          }, {} as Record<number, Club>);
          setClubs(clubMap);
        }
        if (roundData) {
          setCurrentRound(roundData);
          if (new Date() > new Date((roundData as any).deadline_time)) {
            setDeadlinePassed(true);
          }
        } else {
          console.warn('[TeamBuilder] Active round not found or rounds table missing. Defaulting to Pre-Season.');
        }

        if (userTeam) {
          setHasTeam(true);
          // Load existing players if team exists
          const { data: teamPlayers } = await supabase
            .from('team_players')
            .select('*, players(*)')
            .eq('team_id', userTeam.id);
          
          if (teamPlayers) {
            const mapped = teamPlayers.map((tp: any) => ({
              ...tp.players,
              is_starting: tp.is_starting,
              is_captain: tp.is_captain,
              is_vice: tp.is_vice,
              bench_order: tp.bench_order
            }));
            setInitialTeam(mapped, userTeam.budget);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, setInitialTeam]);

  const handleSaveTeam = async () => {
    if (!user) {
      console.warn('[TeamBuilder] Save attempted without active session');
      return;
    }
    
    console.log('[TeamBuilder] Initiating squad entry...');
    console.log('[TeamBuilder] Selected players:', selectedPlayers.map(p => `${p.name} (${p.position})`));
    console.log('[TeamBuilder] Current budget:', budget);

    if (deadlinePassed) {
      console.warn('[TeamBuilder] Deadline passed, entry blocked');
      setAlertState({ isOpen: true, type: 'error', title: 'Deadline Passed', message: 'The deadline for this gameweek has passed.' });
      return;
    }
    if (selectedPlayers.length !== 15) {
      console.warn('[TeamBuilder] Incomplete squad:', selectedPlayers.length, '/ 15');
      setAlertState({ isOpen: true, type: 'error', title: 'Incomplete Squad', message: 'You must select exactly 15 players.' });
      return;
    }

    setSaving(true);
    try {
      let { data: team, error: teamError } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (teamError && teamError.code !== 'PGRST116') throw teamError;

      if (!team) {
        console.log('[TeamBuilder] No existing team found, creating new entry...');
        const { data: newTeam, error: createError } = await supabase
          .from('user_teams')
          .insert({ user_id: user.id, budget })
          .select()
          .single();
        if (createError) throw createError;
        team = newTeam;
      }

      console.log('[TeamBuilder] Team ID identified:', team.id);
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload = {
        team_id: team.id,
        players: selectedPlayers.map(p => ({
          id: p.id,
          is_starting: p.is_starting,
          bench_order: p.bench_order,
          is_captain: p.is_captain,
          is_vice: p.is_vice
        })),
        chips: useTeamStore.getState().activeChips
      };

      console.log('[TeamBuilder] Sending transfers payload to API:', payload);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transfers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('[TeamBuilder] API Response:', { status: response.status, data: result });

      if (!response.ok) throw new Error(result.error || 'Failed to save team');

      setHasTeam(true);
      console.log('[TeamBuilder] Squad saved successfully and locked');
      setAlertState({ isOpen: true, type: 'success', title: 'Success', message: 'Squad entered successfully! Modifications now only via Transfers.' });
    } catch (err: any) {
      console.error('[TeamBuilder] Save error:', err);
      setAlertState({ isOpen: true, type: 'error', title: 'Error', message: err.message || 'Failed to save team.' });
    } finally {
      setSaving(false);
    }
  };

  const renderPlayerShirt = (player: TeamPlayer | null, pos: Position) => {
    if (!player) {
      return (
        <button 
          onClick={() => {
            console.log('[TeamBuilder] Opening picker for position:', pos);
            !hasTeam && setPickerState({ isOpen: true, position: pos });
          }}
          className={cn(
             "flex flex-col items-center group gap-2",
             hasTeam && "opacity-20 cursor-not-allowed"
          )}
          disabled={deadlinePassed || hasTeam}
        >
          <div className="w-12 h-14 md:w-20 md:h-24 bg-white/5 backdrop-blur-md border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/40 transition-all">
            <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-white/20 group-hover:scale-110 transition-transform" />
          </div>
          <div className="bg-black/40 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-tighter">
            {pos}
          </div>
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center relative group animate-in fade-in zoom-in duration-300">
        <div 
          onClick={() => {
            console.log('[TeamBuilder] Showing player info:', player.name);
            setInfoState({ isOpen: true, player });
          }}
          className="w-12 h-14 md:w-20 md:h-24 relative flex items-center justify-center cursor-pointer"
        >
           <div className={cn(
             "w-10 h-12 md:w-16 md:h-20 rounded-xl border-t-4 shadow-xl relative transition-transform group-hover:scale-105",
             pos === 'GK' ? "bg-amber-400 border-amber-600 shadow-amber-900/40" : "bg-indigo-500 border-indigo-700 shadow-indigo-900/40"
           )}>
              <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white/20"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
           </div>
           {!hasTeam && (
              <button 
                onClick={(e) => { 
                   e.stopPropagation(); 
                   console.log('[TeamBuilder] Removing player:', player.name);
                   removePlayer(player.id); 
                }}
                className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all z-20"
              >
                 <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
           )}
        </div>
        <div className="mt-1 md:mt-2 w-full flex flex-col items-center shadow-lg rounded-lg overflow-hidden max-w-[70px] md:max-w-none">
          <div className="bg-slate-900 text-white text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 w-full text-center truncate border-b border-white/5 relative">
            {player.is_captain && (
               <span className="absolute left-1 top-1/2 -translate-y-1/2 bg-amber-500 text-slate-900 text-[6px] md:text-[8px] w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-sm font-black">
                 {useTeamStore.getState().activeChips.includes('triple_captain') ? 'TC' : 'C'}
               </span>
            )}
            {player.is_vice && (
               <span className="absolute left-1 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-900 text-[6px] md:text-[8px] w-3 h-3 md:w-4 md:h-4 flex items-center justify-center rounded-sm font-black">V</span>
            )}
            {player.name.split(' ').pop()}
          </div>
          <div className="bg-white text-slate-900 text-[8px] md:text-xs font-black px-1 md:px-2 py-0.5 md:py-1 w-full text-center">
            £{player.price}m
          </div>
        </div>
        {player.is_captain && (
          <div className="absolute -top-1 -left-1 bg-amber-500 text-white text-[6px] md:text-[8px] font-black w-4 h-4 md:w-5 md:h-5 rounded-lg flex items-center justify-center border-2 border-white shadow-lg animate-bounce">C</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch">
         <div className="flex-1 flex gap-3 md:gap-4">
            <div className="fantasy-card flex-1 p-4 md:p-5 flex items-center gap-3 md:gap-4 bg-gradient-to-br from-[var(--card)] to-[var(--muted)] border-l-4 border-indigo-500">
               <div className="p-2 md:p-3 bg-indigo-500/10 rounded-xl md:rounded-2xl text-indigo-500"><UsersIcon className="w-5 h-5 md:w-6 md:h-6" /></div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">Squad Status</p>
                  <p className="text-lg md:text-2xl font-black">{selectedPlayers.length} <span className="text-[10px] md:text-xs text-[var(--muted-foreground)] font-bold">/ 15</span></p>
               </div>
            </div>
            <div className="fantasy-card flex-1 p-4 md:p-5 flex items-center gap-3 md:gap-4 bg-gradient-to-br from-[var(--card)] to-[var(--muted)] border-l-4 border-emerald-500">
               <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl md:rounded-2xl text-emerald-500"><DollarSign className="w-5 h-5 md:w-6 md:h-6" /></div>
               <div>
                  <p className="text-[8px] md:text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest">Bank</p>
                  <p className="text-lg md:text-2xl font-black text-emerald-500">£{budget.toFixed(1)}m</p>
               </div>
            </div>
         </div>
         
         {!hasTeam && (
            <div className="flex items-center gap-3 md:gap-4">
               <button
                  onClick={handleSaveTeam}
                  disabled={saving || selectedPlayers.length !== 15 || deadlinePassed}
                  className="fantasy-button bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 hover:scale-105 flex-1 md:flex-none md:h-full py-3 md:px-10 flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
               >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span className="font-black uppercase tracking-tighter text-sm">{saving ? 'Saving...' : 'Enter Squad'}</span>
               </button>
            </div>
         )}
         {hasTeam && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 flex items-center gap-4">
               <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               <div className="text-left">
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Squad Locked</p>
                  <p className="text-xs font-bold text-emerald-700">Go to Transfers to make changes.</p>
               </div>
            </div>
         )}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 md:gap-10">
        {/* Pitch Area */}
        <div className="flex-1 space-y-6">
          <div className="pitch-container p-4 md:p-12 flex flex-col justify-between items-center relative border-4 md:border-8 border-white/5 shadow-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[500px] md:min-h-[700px]">
            {/* Field Markings */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/20"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-white/20"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-white/20"></div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10"></div>
            
            {/* Goalkeepers - 2 slots */}
            <div className="flex justify-around w-full max-w-[250px] md:max-w-sm z-10">
              {Array.from({ length: 2 }).map((_, i) => {
                const p = selectedPlayers.filter(p => p.position === 'GK')[i];
                return <div key={i}>{renderPlayerShirt(p || null, 'GK')}</div>;
              })}
            </div>

            {/* Defenders - 5 slots */}
            <div className="flex justify-around w-full z-10 gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const p = selectedPlayers.filter(p => p.position === 'DEF')[i];
                return <div key={i}>{renderPlayerShirt(p || null, 'DEF')}</div>;
              })}
            </div>

            {/* Midfielders - 5 slots */}
            <div className="flex justify-around w-full z-10 gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const p = selectedPlayers.filter(p => p.position === 'MID')[i];
                return <div key={i}>{renderPlayerShirt(p || null, 'MID')}</div>;
              })}
            </div>

            {/* Forwards - 3 slots */}
            <div className="flex justify-around w-full max-w-[300px] md:max-w-md z-10 gap-4">
              {Array.from({ length: 3 }).map((_, i) => {
                const p = selectedPlayers.filter(p => p.position === 'FWD')[i];
                return <div key={i}>{renderPlayerShirt(p || null, 'FWD')}</div>;
              })}
            </div>
          </div>
        </div>

        {/* Market Sidebar - Hidden on mobile, shown on XL screens */}
        {!hasTeam && (
            <div className="hidden xl:flex w-[400px] flex-col gap-6">
               <div className="fantasy-card flex-1 flex flex-col min-h-[600px] border-none shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="p-6 border-b border-[var(--border)] relative z-10">
                     <div className="flex items-center justify-between mb-6">
                        <div>
                           <h2 className="text-xl font-black italic uppercase tracking-tighter">Market <span className="text-[var(--primary)]">Explorer</span></h2>
                           <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mt-1">15 players • £100m Budget</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[var(--primary)] animate-pulse" />
                     </div>
                     
                     <div className="space-y-4">
                        <div className="relative group">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
                           <input 
                              type="text" 
                              placeholder="Search world-class talent..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full bg-[var(--muted)] border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] transition-all placeholder:text-[var(--muted-foreground)]/50"
                           />
                        </div>
                        
                        <div className="flex gap-2">
                           {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map(pos => (
                              <button 
                                 key={pos}
                                 onClick={() => setPosFilter(pos)}
                                 className={cn(
                                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    posFilter === pos 
                                      ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                                 )}
                              >
                                 {pos}
                              </button>
                           ))}
                        </div>

                        {/* Chips Selection */}
                        <div className="pt-4 border-t border-[var(--border)]">
                          <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-3 flex items-center gap-2">
                             <TrendingUp className="w-3 h-3 text-[var(--primary)]" /> Tactical Chips
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'wildcard', name: 'Wildcard', desc: 'Unlimited' },
                              { id: 'triple_captain', name: 'Triple Cap', desc: '3x Pts' },
                              { id: 'bench_boost', name: 'Bench Boost', desc: 'Bench Pts' },
                              { id: '12th_man', name: '12th Man', desc: '+1 Player' }
                            ].map(chip => {
                              const isActive = useTeamStore(state => state.activeChips.includes(chip.id));
                              return (
                                <button
                                  key={chip.id}
                                  onClick={() => toggleChip(chip.id)}
                                  className={cn(
                                    "p-2 rounded-xl border transition-all text-left relative",
                                    isActive 
                                      ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" 
                                      : "bg-[var(--muted)] border-transparent text-[var(--foreground)] hover:border-[var(--primary)]/30"
                                  )}
                                >
                                  <p className="text-[9px] font-black uppercase tracking-tight">{chip.name}</p>
                                  <p className={cn("text-[7px] font-bold opacity-60", isActive && "text-white/80")}>{chip.desc}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-10">
                     {players
                        .filter(p => (posFilter === 'ALL' || p.position === posFilter))
                        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(player => {
                           const isSelected = selectedPlayers.some(sp => sp.id === player.id);
                           const clubCount = selectedPlayers.filter(p => p.club_id === player.club_id).length;
                           const isClubLimitReached = clubCount >= 3;
                           const isBudgetExceeded = budget < player.price;
                           const isDisabled = (isClubLimitReached || isBudgetExceeded) && !isSelected;

                           return (
                              <div 
                                 key={player.id} 
                                 onClick={() => {
                                    if (hasTeam || isDisabled) return;
                                    isSelected ? removePlayer(player.id) : addPlayer(player);
                                 }}
                                 className={cn(
                                    "p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                    isSelected 
                                      ? "bg-[var(--muted)] border-transparent opacity-40 grayscale" 
                                      : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-0.5 cursor-pointer",
                                    (hasTeam || isDisabled) && "opacity-20 cursor-not-allowed grayscale blur-[1px]"
                                 )}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={cn(
                                       "w-10 h-12 rounded-xl flex items-center justify-center text-white relative shadow-lg",
                                       player.position === 'GK' ? "bg-amber-400" : 
                                       player.position === 'DEF' ? "bg-blue-500" : 
                                       player.position === 'MID' ? "bg-emerald-500" : "bg-rose-500"
                                    )}>
                                       <Shield className="w-5 h-5 opacity-20" />
                                       <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black">{player.position}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-[var(--foreground)]">{player.name}</h4>
                                       <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-tight">
                                          {clubs[player.club_id]?.name}
                                       </p>
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-4">
                                    <span className={cn("text-sm font-black", isBudgetExceeded && !isSelected ? "text-rose-500" : "text-[var(--primary)]")}>
                                       £{player.price}m
                                    </span>
                                    {!hasTeam && (
                                       <button className={cn(
                                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                          isSelected 
                                            ? "bg-rose-500/10 text-rose-500" 
                                            : "bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                                       )}>
                                          {isSelected ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                       </button>
                                    )}
                                 </div>
                              </div>
                           );
                        })
                     }
                  </div>

                  <div className="p-6 bg-[var(--muted)]/50 border-t border-[var(--border)] relative z-10">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                           <Info className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest leading-relaxed">
                           Max 3 players per club. Ensure 15 players are selected to finalize your entry.
                        </p>
                     </div>
                     
                     <button
                        onClick={handleSaveTeam}
                        disabled={saving || selectedPlayers.length !== 15 || deadlinePassed || hasTeam}
                        className="fantasy-button w-full bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 py-4 flex items-center justify-center gap-3 disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                     >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        <span className="font-black uppercase tracking-widest text-xs">
                           {hasTeam ? 'Squad Locked' : selectedPlayers.length < 15 ? `Select ${15 - selectedPlayers.length} More` : 'Enter Arena'}
                        </span>
                     </button>
                  </div>
               </div>
            </div>
        )}
      </div>

      <AlertModal 
        isOpen={alertState.isOpen} 
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))} 
        type={alertState.type} 
        title={alertState.title} 
        message={alertState.message} 
      />

      <PlayerPickerModal
        isOpen={pickerState.isOpen}
        onClose={() => setPickerState(prev => ({ ...prev, isOpen: false }))}
        position={pickerState.position}
        players={players}
        clubs={clubs}
        onSelect={addPlayer}
        budget={budget}
        selectedPlayers={selectedPlayers}
      />

      <PlayerInfoModal
        isOpen={infoState.isOpen}
        onClose={() => setInfoState(prev => ({ ...prev, isOpen: false }))}
        player={infoState.player}
        clubName={infoState.player ? clubs[infoState.player.club_id]?.name : ''}
      />
    </div>
  );
}