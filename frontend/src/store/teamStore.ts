import { create } from 'zustand';

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: number;
  name: string;
  position: Position;
  price: number;
  club_id: number;
}

export interface TeamPlayer extends Player {
  is_starting: boolean;
  bench_order: number | null; // 1 to 4
  is_captain: boolean;
  is_vice: boolean;
}

interface TeamStore {
  selectedPlayers: TeamPlayer[];
  budget: number;
  activeChips: string[];
  maxPerClub: number;
  setMaxPerClub: (limit: number) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: number) => void;
  swapPlayers: (playerOutId: number, playerInId: number) => void;
  setCaptain: (playerId: number, isVice?: boolean) => void;
  toggleChip: (chipType: string) => void;
  resetTeam: () => void;
  setInitialTeam: (players: TeamPlayer[], budget: number) => void;
}

const MAX_PLAYERS = {
  GK: 2,
  DEF: 5,
  MID: 5,
  FWD: 3
};

const INITIAL_BUDGET = 100.0;

export const useTeamStore = create<TeamStore>((set, get) => ({
  selectedPlayers: [],
  budget: INITIAL_BUDGET,
  activeChips: [],
  maxPerClub: 3,

  setMaxPerClub: (limit: number) => set({ maxPerClub: limit }),

  setInitialTeam: (players, budget) => set({ selectedPlayers: players, budget }),

  toggleChip: (chipType) => set((state) => {
    const isActive = state.activeChips.includes(chipType);
    return {
      activeChips: isActive 
        ? state.activeChips.filter(c => c !== chipType)
        : [...state.activeChips, chipType]
    };
  }),

  addPlayer: (player) => {
    const state = get();
    if (state.budget < player.price) return; 
    if (state.selectedPlayers.some(p => p.id === player.id)) return; 

    const positionCount = state.selectedPlayers.filter(p => p.position === player.position).length;
    if (positionCount >= MAX_PLAYERS[player.position]) return; 
    if (state.selectedPlayers.length >= 15) return; 

    const clubCount = state.selectedPlayers.filter(p => p.club_id === player.club_id).length;
    if (clubCount >= state.maxPerClub) return;

    set((state) => {
      const startersInPos = state.selectedPlayers.filter(p => p.position === player.position && p.is_starting).length;
      let is_starting = false;
      let bench_order: number | null = null;

      const currentStarters = state.selectedPlayers.filter(p => p.is_starting).length;
      if (currentStarters < 11) {
        if (player.position === 'GK' && startersInPos >= 1) {
          is_starting = false;
        } else {
          is_starting = true;
        }
      }

      if (!is_starting) {
        const currentBench = state.selectedPlayers.filter(p => !p.is_starting).length;
        bench_order = currentBench + 1;
      }

      const is_captain = state.selectedPlayers.filter(p => p.is_captain).length === 0;
      const is_vice = !is_captain && state.selectedPlayers.filter(p => p.is_vice).length === 0;

      const newPlayer: TeamPlayer = {
        ...player,
        is_starting,
        bench_order,
        is_captain,
        is_vice
      };

      return {
        selectedPlayers: [...state.selectedPlayers, newPlayer],
        budget: parseFloat((state.budget - player.price).toFixed(1))
      };
    });
  },

  removePlayer: (playerId) => set((state) => {
    const playerToRemove = state.selectedPlayers.find(p => p.id === playerId);
    if (!playerToRemove) return state;

    let updatedPlayers = state.selectedPlayers.filter(p => p.id !== playerId);
    
    // Auto-reassign captain/vice if removed
    if (playerToRemove.is_captain && updatedPlayers.length > 0) {
       updatedPlayers[0].is_captain = true;
    } else if (playerToRemove.is_vice && updatedPlayers.length > 1) {
       updatedPlayers[1].is_vice = true;
    }

    return {
      selectedPlayers: updatedPlayers,
      budget: parseFloat((state.budget + playerToRemove.price).toFixed(1))
    };
  }),

  swapPlayers: (playerOutId, playerInId) => set((state) => {
    const outPlayer = state.selectedPlayers.find(x => x.id === playerOutId);
    const inPlayer = state.selectedPlayers.find(x => x.id === playerInId);
    if (!outPlayer || !inPlayer) return state;

    const updatedPlayers = state.selectedPlayers.map(p => {
      if (p.id === playerOutId) {
        return { ...p, is_starting: inPlayer.is_starting, bench_order: inPlayer.bench_order };
      }
      if (p.id === playerInId) {
        return { ...p, is_starting: outPlayer.is_starting, bench_order: outPlayer.bench_order };
      }
      return p;
    });

    const starters = updatedPlayers.filter(p => p.is_starting);
    const gkCount = starters.filter(p => p.position === 'GK').length;
    const defCount = starters.filter(p => p.position === 'DEF').length;
    const midCount = starters.filter(p => p.position === 'MID').length;
    const fwdCount = starters.filter(p => p.position === 'FWD').length;

    const isValidFormation = 
      gkCount === 1 &&
      defCount >= 3 && defCount <= 5 &&
      midCount >= 2 && midCount <= 5 &&
      fwdCount >= 1 && fwdCount <= 3 &&
      starters.length === 11;

    if (!isValidFormation) return state;
    return { selectedPlayers: updatedPlayers };
  }),

  setCaptain: (playerId, isVice = false) => set((state) => {
    return {
      selectedPlayers: state.selectedPlayers.map(p => ({
        ...p,
        is_captain: isVice ? p.is_captain : (p.id === playerId),
        is_vice: isVice ? (p.id === playerId) : (p.id === playerId ? false : p.is_vice)
      }))
    };
  }),

  resetTeam: () => set({ selectedPlayers: [], budget: INITIAL_BUDGET, activeChips: [] })
}));