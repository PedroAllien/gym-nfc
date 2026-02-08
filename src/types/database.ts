export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercicios: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          youtube_url: string;
          youtube_id: string;
          thumbnail: string;
          categoria_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          youtube_url: string;
          youtube_id: string;
          thumbnail: string;
          categoria_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          youtube_url?: string;
          youtube_id?: string;
          thumbnail?: string;
          categoria_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      treinos: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      treino_exercicios: {
        Row: {
          id: string;
          treino_id: string;
          exercicio_id: string;
          ordem: number;
          series: number | null;
          repeticoes: string | null;
          descanso: string | null;
          observacao: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          treino_id: string;
          exercicio_id: string;
          ordem: number;
          series?: number | null;
          repeticoes?: string | null;
          descanso?: string | null;
          observacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          treino_id?: string;
          exercicio_id?: string;
          ordem?: number;
          series?: number | null;
          repeticoes?: string | null;
          descanso?: string | null;
          observacao?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
