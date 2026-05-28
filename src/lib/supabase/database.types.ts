// Supabase requires concrete object types (not Omit<>) in Database generics
// to correctly infer .insert()/.update() parameter types.

export type Database = {
  public: {
    Tables: {
      landing_pages: {
        Row: {
          id: string
          tenant_id: string
          nama_website: string
          slug: string | null
          domain_custom: string | null
          tipe_industri: string
          status: string
          data_konten: Record<string, unknown>
          konfigurasi: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          nama_website: string
          slug?: string | null
          domain_custom?: string | null
          tipe_industri: string
          status?: string
          data_konten?: Record<string, unknown>
          konfigurasi?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          nama_website?: string
          slug?: string | null
          domain_custom?: string | null
          tipe_industri?: string
          status?: string
          data_konten?: Record<string, unknown>
          konfigurasi?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      page_sections: {
        Row: {
          id: string
          page_id: string
          tenant_id: string
          urutan: number
          tipe_komponen: string
          is_visible: boolean
          isi_komponen: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          tenant_id: string
          urutan?: number
          tipe_komponen: string
          is_visible?: boolean
          isi_komponen?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          tenant_id?: string
          urutan?: number
          tipe_komponen?: string
          is_visible?: boolean
          isi_komponen?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_tenant_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Views: Record<string, never>
    Enums: Record<string, never>
  }
}
