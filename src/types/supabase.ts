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
      leads: {
        Row: {
          id: string
          created_at: string
          email: string
          source: string
          status: 'new' | 'contacted' | 'qualified' | 'converted'
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          source?: string
          status?: 'new' | 'contacted' | 'qualified' | 'converted'
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          source?: string
          status?: 'new' | 'contacted' | 'qualified' | 'converted'
          metadata?: Json
        }
      }
    }
  }
}