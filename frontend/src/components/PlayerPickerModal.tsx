import { useState } from 'react';
import { Search, X, Shield, Plus, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { cn } from '../lib/utils';
import { type Position, type TeamPlayer } from '../store/teamStore';
import { AlertModal, type AlertType } from './Alerts';

interface PlayerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position | 'ALL';
  players: any[];
  clubs: Record<number, any>;
  onSelect: (player: any) => void;
  budget: number;
  selectedPlayers: TeamPlayer[];
}

export function PlayerPickerModal({
  isOpen,
  onClose,
  position,
  players,
  clubs,
  onSelect,
  budget,
  selectedPlayers
}: PlayerPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ isOpen: boolean; title: string; message: string; type: AlertType }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  const selectedIds = selectedPlayers.map(p => p.id);
  const clubCounts = selectedPlayers.reduce((acc, p) => {
    acc[p.club_id] = (acc[p.club_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const filteredPlayers = players
    .filter(p => (position === 'ALL' || p.position === position))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.price - a.price);

  const handleSelect = (player: any) => {
    if (selectedIds.includes(player.id)) {
      setAlert({
        isOpen: true,
        title: 'Player Already Selected',
        message: `${player.name} is already in your squad.`,
        type: 'warning'
      });
      return;
    }

    if (budget < player.price) {
      setAlert({
        isOpen: true,
        title: 'Insufficient Budget',
        message: `You need £${player.price}m but only have £${budget.toFixed(1)}m remaining.`,
        type: 'error'
      });
      return;
    }

    if ((clubCounts[player.club_id] || 0) >= 3) {
      setAlert({
        isOpen: true,
        title: 'Club Limit Reached',
        message: `You can only select up to 3 players from ${clubs[player.club_id]?.name || 'the same club'}.`,
        type: 'error'
      });
      return;
    }

    onSelect(player);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-xl h-[85vh] flex flex-col !p-0 overflow-hidden bg-[var(--card)] border border-[var(--border)]"
      >
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 to-transparent">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                Select <span className="text-[var(--primary)]">{position === 'ALL' ? 'Player' : position}</span>
              </h2>
              <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mt-1">
                Available Budget: £{budget.toFixed(1)}m
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-xl transition-colors">
              <X className="w-6 h-6 text-[var(--muted-foreground)]" />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--muted)] border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[var(--primary)] transition-all"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => {
              const isSelected = selectedIds.includes(player.id);
              const isBudgetExceeded = budget < player.price;
              const isClubLimitReached = (clubCounts[player.club_id] || 0) >= 3;
              const isDisabled = (isBudgetExceeded || isClubLimitReached) && !isSelected;

              return (
                <div
                  key={player.id}
                  onClick={() => isDisabled || isSelected ? handleSelect(player) : handleSelect(player)}
                  className={cn(
                    "p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-between group cursor-pointer",
                    isDisabled && "opacity-40 grayscale blur-[1px] cursor-not-allowed",
                    isSelected && "border-[var(--primary)] bg-[var(--primary)]/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-14 rounded-xl flex items-center justify-center text-white relative shadow-lg",
                      player.position === 'GK' ? "bg-amber-400" : 
                      player.position === 'DEF' ? "bg-blue-500" : 
                      player.position === 'MID' ? "bg-emerald-500" : "bg-rose-500"
                    )}>
                      <Shield className="w-6 h-6 opacity-20" />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{player.position}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[var(--foreground)]">{player.name}</h4>
                      <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-tight flex items-center gap-2">
                        {clubs[player.club_id]?.name || 'Unknown Club'}
                        {isClubLimitReached && !isSelected && <span className="text-rose-500 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Club Full</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase">Price</p>
                      <p className={cn("text-sm font-black", isBudgetExceeded && !isSelected ? "text-rose-500" : "text-[var(--primary)]")}>£{player.price}m</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(player);
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                        isSelected ? "bg-emerald-500 text-white" : "bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                      )}
                    >
                      {isSelected ? <TrendingUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
              <TrendingUp className="w-10 h-10" />
              <p className="font-black uppercase text-xs tracking-widest">No players found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-indigo-500/5 flex items-center gap-3">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <p className="text-[9px] text-[var(--muted-foreground)] font-bold uppercase tracking-tight leading-relaxed">
            Max 3 players per club. Ensure you stay within the £100m budget for your 15-man squad.
          </p>
        </div>
      </Modal>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </>
  );
}

