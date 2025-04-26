export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      medical_events: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          pet_id: string
          title: string
          type: Database["public"]["Enums"]["medical_event_type"]
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          pet_id: string
          title: string
          type: Database["public"]["Enums"]["medical_event_type"]
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          pet_id?: string
          title?: string
          type?: Database["public"]["Enums"]["medical_event_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_events_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          allergies: string | null
          birth_date: string
          breed: string | null
          color: string | null
          created_at: string | null
          gender: Database["public"]["Enums"]["pet_gender"] | null
          id: string
          microchip: string | null
          name: string
          owner_id: string | null
          photo_url: string | null
          qr_number: string | null
          species: Database["public"]["Enums"]["pet_species"] | null
          sterilized: boolean | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          allergies?: string | null
          birth_date: string
          breed?: string | null
          color?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["pet_gender"] | null
          id?: string
          microchip?: string | null
          name: string
          owner_id?: string | null
          photo_url?: string | null
          qr_number?: string | null
          species?: Database["public"]["Enums"]["pet_species"] | null
          sterilized?: boolean | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          allergies?: string | null
          birth_date?: string
          breed?: string | null
          color?: string | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["pet_gender"] | null
          id?: string
          microchip?: string | null
          name?: string
          owner_id?: string | null
          photo_url?: string | null
          qr_number?: string | null
          species?: Database["public"]["Enums"]["pet_species"] | null
          sterilized?: boolean | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          code_expires_at: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone_number: string
          security_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code_expires_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone_number: string
          security_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code_expires_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone_number?: string
          security_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      verify_security_code: {
        Args: { phone: string; code: string }
        Returns: {
          id: string
          phone_number: string
          name: string
          email: string
        }[]
      }
    }
    Enums: {
      medical_event_type:
        | "vaccine"
        | "surgery"
        | "emergency"
        | "checkup"
        | "other"
      pet_gender: "male" | "female" | "unknown"
      pet_species: "Perro" | "Gato"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      medical_event_type: [
        "vaccine",
        "surgery",
        "emergency",
        "checkup",
        "other",
      ],
      pet_gender: ["male", "female", "unknown"],
      pet_species: ["Perro", "Gato"],
    },
  },
} as const
