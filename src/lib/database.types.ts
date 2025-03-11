export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_price: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_price: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_price?: number;
          status?: string;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          description?: string | null;
          created_at?: string;
        };
      };
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
}
