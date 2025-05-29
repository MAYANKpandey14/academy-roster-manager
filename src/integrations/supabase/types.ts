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
      archived_staff: {
        Row: {
          archived_at: string
          archived_by: string | null
          blood_group: string
          class_no: string | null
          class_subject: string | null
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          education: string
          father_name: string
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          blood_group: string
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          education: string
          father_name: string
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          blood_group?: string
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          education?: string
          father_name?: string
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      archived_trainees: {
        Row: {
          archived_at: string
          archived_by: string | null
          arrival_date: string
          blood_group: string
          chest_no: string
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          arrival_date: string
          blood_group: string
          chest_no: string
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          arrival_date?: string
          blood_group?: string
          chest_no?: string
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          departure_date?: string
          education?: string
          father_name?: string
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          blood_group: string
          class_no: string | null
          class_subject: string | null
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          education: string
          father_name: string
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          blood_group: string
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          education: string
          father_name: string
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          blood_group?: string
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          education?: string
          father_name?: string
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_attendance: {
        Row: {
          approval_status: string
          created_at: string | null
          date: string
          id: string
          staff_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          approval_status?: string
          created_at?: string | null
          date: string
          id?: string
          staff_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          approval_status?: string
          created_at?: string | null
          date?: string
          id?: string
          staff_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_leave: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          leave_type: string | null
          reason: string
          staff_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          leave_type?: string | null
          reason: string
          staff_id: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          leave_type?: string | null
          reason?: string
          staff_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_leave_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      trainee_attendance: {
        Row: {
          approval_status: string
          created_at: string | null
          date: string
          id: string
          status: string
          trainee_id: string
          updated_at: string | null
        }
        Insert: {
          approval_status?: string
          created_at?: string | null
          date: string
          id?: string
          status?: string
          trainee_id: string
          updated_at?: string | null
        }
        Update: {
          approval_status?: string
          created_at?: string | null
          date?: string
          id?: string
          status?: string
          trainee_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainee_attendance_trainee_id_fkey"
            columns: ["trainee_id"]
            isOneToOne: false
            referencedRelation: "trainees"
            referencedColumns: ["id"]
          },
        ]
      }
      trainee_leave: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          leave_type: string | null
          reason: string
          start_date: string
          status: string
          trainee_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          leave_type?: string | null
          reason: string
          start_date: string
          status?: string
          trainee_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          leave_type?: string | null
          reason?: string
          start_date?: string
          status?: string
          trainee_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainee_leave_trainee_id_fkey"
            columns: ["trainee_id"]
            isOneToOne: false
            referencedRelation: "trainees"
            referencedColumns: ["id"]
          },
        ]
      }
      trainees: {
        Row: {
          arrival_date: string
          blood_group: string
          chest_no: string
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          arrival_date: string
          blood_group: string
          chest_no: string
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          arrival_date?: string
          blood_group?: string
          chest_no?: string
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          departure_date?: string
          education?: string
          father_name?: string
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
