import { Modal } from './Modal';
import { Trophy, Shield, X, Calendar } from 'lucide-react';
import type { TeamPlayer } from '../store/teamStore';
import { cn } from './Layout';

interface Club {
  id: number;
  name: string;
  country: string;
}

interface InteractivePlayerCardProps {
  player: TeamPlayer;
  club: Club;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: 'captain' | 'vice' | 'remove') => void;
  showActions?: boolean;
}

export function InteractivePlayerCard({
  player,
  club,
  isOpen,
  onClose,
  onAction,
  showActions = true
}: InteractivePlayerCardProps) {
  if (!player) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick={true} className="max-w-lg p-0 bg-slate-50">
      {/* Header FPL Style */}
      <div className="bg-[var(--fpl-purple)] text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--fpl-pink)] opacity-20 rounded-bl-full -mr-10 -mt-10" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            {/* Mock Player Image / Crest */}
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-lg font-black text-2xl bg-white text-[var(--fpl-purple)]"
            )}>
              {club?.name.substring(0, 2).toUpperCase() || 'FC'}
            </div>
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-1">{player.name}</h3>
              <p className="text-[var(--fpl-green)] font-bold uppercase text-sm flex items-center gap-2">
                <span>{club?.name || 'Unknown Club'}</span>
                <span className="w-1.5 h-1.5 bg-[var(--fpl-green)] rounded-full inline-block" />
                <span>{player.position}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="p-6 grid grid-cols-3 gap-4 border-b border-slate-200 bg-white">
        <div className="text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price</span>
          <span className="text-xl font-black text-[var(--fpl-purple)]">£{player.price}m</span>
        </div>
        <div className="text-center border-x border-slate-100">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Form</span>
          <span className="text-xl font-black text-[var(--fpl-purple)]">7.5</span>
        </div>
        <div className="text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pts</span>
          <span className="text-xl font-black text-[var(--fpl-purple)]">124</span>
        </div>
      </div>

      {/* Tabs / Detailed info Mock */}
      <div className="p-6 bg-white space-y-6">
        <h4 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
          <Calendar className="h-4 w-4 text-[var(--fpl-pink)]" /> Next Fixtures
        </h4>
        <div className="space-y-2">
          {/* Mock Fixtures */}
          {[1, 2, 3].map(i => (
            <div key={i} className="flex justify-between items-center text-sm p-2 rounded bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-600">GW {i}</span>
              <span className="font-medium text-slate-800 flex items-center gap-2">
                Team {i} 
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-black text-white", i === 1 ? "bg-red-500" : i === 2 ? "bg-emerald-500" : "bg-slate-400")}>
                  {i === 1 ? 'FDR 5' : i === 2 ? 'FDR 2' : 'FDR 3'}
                </span>
              </span>
              <span className="text-slate-400 font-medium">Sat 15:00</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={() => onAction('captain')} 
            className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 shadow-sm rounded-md hover:border-yellow-400 hover:bg-yellow-50 transition-all text-slate-700"
          >
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-bold uppercase">Make Captain</span>
          </button>
          <button 
            onClick={() => onAction('vice')} 
            className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 shadow-sm rounded-md hover:border-slate-400 hover:bg-slate-100 transition-all text-slate-700"
          >
            <Shield className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-bold uppercase">Make Vice</span>
          </button>
          <button 
            onClick={() => onAction('remove')} 
            className="col-span-2 flex items-center justify-center gap-2 p-3 border border-red-200 bg-red-50 rounded-md hover:bg-red-100 hover:border-red-300 transition-all text-red-600"
          >
            <X className="h-5 w-5" />
            <span className="text-sm font-bold uppercase">Remove from Squad</span>
          </button>
        </div>
      )}
    </Modal>
  );
}
