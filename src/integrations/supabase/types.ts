export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      archive_folders: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          folder_name: string
          id: string
          item_count: number | null
          last_modified: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          folder_name: string
          id?: string
          item_count?: number | null
          last_modified?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          folder_name?: string
          id?: string
          item_count?: number | null
          last_modified?: string | null
        }
        Relationships: []
      }
      archived_staff: {
        Row: {
          archived_at: string
          archived_by: string | null
          arrival_date: string | null
          arrival_date_rtc: string | null
          blood_group: string
          category_caste: string | null
          class_no: string | null
          class_subject: string | null
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string | null
          education: string
          father_name: string
          folder_id: string | null
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          status: string | null
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          arrival_date?: string | null
          arrival_date_rtc?: string | null
          blood_group: string
          category_caste?: string | null
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date?: string | null
          education: string
          father_name: string
          folder_id?: string | null
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank: string
          status?: string | null
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          arrival_date?: string | null
          arrival_date_rtc?: string | null
          blood_group?: string
          category_caste?: string | null
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          departure_date?: string | null
          education?: string
          father_name?: string
          folder_id?: string | null
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          status?: string | null
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archived_staff_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "archive_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_trainees: {
        Row: {
          archived_at: string
          archived_by: string | null
          arrival_date: string
          blood_group: string
          category_caste: string | null
          chest_no: string
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          folder_id: string | null
          home_address: string
          id: string
          mobile_number: string
          name: string
          nominee: string
          photo_url: string | null
          pno: string
          rank: string
          status: string | null
          toli_no: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string
          archived_by?: string | null
          arrival_date: string
          blood_group: string
          category_caste?: string | null
          chest_no: string
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string
          education: string
          father_name: string
          folder_id?: string | null
          home_address: string
          id?: string
          mobile_number: string
          name: string
          nominee: string
          photo_url?: string | null
          pno: string
          rank?: string
          status?: string | null
          toli_no?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string
          archived_by?: string | null
          arrival_date?: string
          blood_group?: string
          category_caste?: string | null
          chest_no?: string
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          departure_date?: string
          education?: string
          father_name?: string
          folder_id?: string | null
          home_address?: string
          id?: string
          mobile_number?: string
          name?: string
          nominee?: string
          photo_url?: string | null
          pno?: string
          rank?: string
          status?: string | null
          toli_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archived_trainees_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "archive_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          arrival_date: string | null
          blood_group: string
          category_caste: string | null
          class_no: string | null
          class_subject: string | null
          created_at: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date: string | null
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
          arrival_date?: string | null
          blood_group: string
          category_caste?: string | null
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district: string
          date_of_birth: string
          date_of_joining: string
          departure_date?: string | null
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
          arrival_date?: string | null
          blood_group?: string
          category_caste?: string | null
          class_no?: string | null
          class_subject?: string | null
          created_at?: string | null
          current_posting_district?: string
          date_of_birth?: string
          date_of_joining?: string
          departure_date?: string | null
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
          category_caste: string | null
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
          category_caste?: string | null
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
          category_caste?: string | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
