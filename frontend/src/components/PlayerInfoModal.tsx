import { Modal } from './Modal';
import { X, Shield, TrendingUp, Activity, Award, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { type TeamPlayer } from '../store/teamStore';

interface PlayerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: TeamPlayer | any | null;
  clubName?: string;
}

export function PlayerInfoModal({ isOpen, onClose, player, clubName }: PlayerInfoModalProps) {
  if (!player) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md !p-0 overflow-hidden bg-[var(--card)] border border-[var(--border)]"
    >
      <div className={cn(
        "p-8 text-white relative overflow-hidden",
        player.position === 'GK' ? "bg-amber-400" : 
        player.position === 'DEF' ? "bg-blue-500" : 
        player.position === 'MID' ? "bg-emerald-500" : "bg-rose-500"
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-xl transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-28 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 flex items-center justify-center shadow-2xl mb-4 relative">
             <Shield className="w-16 h-16 opacity-20" />
             <User className="w-12 h-12 absolute" />
             <div className="absolute -bottom-2 bg-white text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                {player.position}
             </div>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center">{player.name}</h2>
          <p className="text-white/80 font-bold tracking-widest text-[10px] uppercase mt-1">{clubName || 'Unknown Club'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--muted)] p-5 rounded-2xl border border-[var(--border)] text-center shadow-sm">
               <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Price</p>
               <p className="text-xl font-black italic text-[var(--primary)]">£{player.price}m</p>
            </div>
            <div className="bg-[var(--muted)] p-5 rounded-2xl border border-[var(--border)] text-center shadow-sm">
               <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Total Pts</p>
               <p className="text-xl font-black italic text-[var(--foreground)]">--</p>
            </div>
            <div className="bg-[var(--muted)] p-5 rounded-2xl border border-[var(--border)] text-center shadow-sm">
               <p className="text-[9px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Ownership</p>
               <p className="text-xl font-black italic text-[var(--foreground)]">--%</p>
            </div>
          </div>

          <div className="space-y-5">
             <h3 className="text-[11px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" /> Season Performance
             </h3>
             <div className="bg-[var(--muted)]/30 rounded-3xl p-6 border border-[var(--border)] space-y-4">
                {[
                  { label: 'Goals Scored', value: '0' },
                  { label: 'Assists', value: '0' },
                  { label: 'Clean Sheets', value: '0' },
                  { label: 'Bonus Points', value: '0' },
                  { label: 'Yellow Cards', value: '0' },
                  { label: 'Minutes Played', value: '0' }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-[var(--border)]/50 last:border-0 last:pb-0 first:pt-0">
                     <span className="text-xs font-bold text-[var(--muted-foreground)]">{stat.label}</span>
                     <span className="text-xs font-black text-[var(--foreground)]">{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Match Fit</span>
         </div>
         <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Elite Form</span>
         </div>
      </div>
    </Modal>
  );
}
