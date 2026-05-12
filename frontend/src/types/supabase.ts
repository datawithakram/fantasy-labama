export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          provider: string | null
        }
        Insert: any
        Update: any
      }
      user_teams: {
        Row: {
          id: string
          user_id: string
          budget: number
          created_at: string
        }
        Insert: any
        Update: any
      }
      team_players: {
        Row: {
          id: number
          team_id: string
          player_id: number
          is_starting: boolean
          bench_order: number | null
          is_captain: boolean
          is_vice: boolean
          is_active: boolean
          added_round: number | null
          removed_round: number | null
        }
        Insert: any
        Update: any
      }
      team_scores: {
        Row: {
          id: number
          team_id: string
          round_id: number | null
          points: number
        }
        Insert: any
        Update: any
      }
      players: {
        Row: {
          id: number
          name: string
          position: string
          price: number
          club_id: number
        }
        Insert: any
        Update: any
      }
      clubs: {
        Row: {
          id: number
          name: string
          country: string | null
        }
        Insert: any
        Update: any
      }
    }
  }
}
