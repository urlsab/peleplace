export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          event_date: string
          guest_user_id: string
          host_type: string
          host_user_id: string
          id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_date: string
          guest_user_id: string
          host_type: string
          host_user_id: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_date?: string
          guest_user_id?: string
          host_type?: string
          host_user_id?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string
          subject?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      host_family_profiles: {
        Row: {
          about_us: string | null
          available_dates: string[] | null
          city: string | null
          created_at: string
          guest_preference:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id: string
          region: Database["public"]["Enums"]["region"] | null
          religious_level: Database["public"]["Enums"]["religious_level"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about_us?: string | null
          available_dates?: string[] | null
          city?: string | null
          created_at?: string
          guest_preference?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id?: string
          region?: Database["public"]["Enums"]["region"] | null
          religious_level?:
            | Database["public"]["Enums"]["religious_level"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about_us?: string | null
          available_dates?: string[] | null
          city?: string | null
          created_at?: string
          guest_preference?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id?: string
          region?: Database["public"]["Enums"]["region"] | null
          religious_level?:
            | Database["public"]["Enums"]["religious_level"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      host_volunteer_profiles: {
        Row: {
          city: string | null
          created_at: string
          id: string
          place_name: string
          provides_accommodation: boolean | null
          provides_meals: boolean | null
          region: Database["public"]["Enums"]["region"] | null
          special_requirements: string | null
          updated_at: string
          user_id: string
          volunteer_type: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          place_name: string
          provides_accommodation?: boolean | null
          provides_meals?: boolean | null
          region?: Database["public"]["Enums"]["region"] | null
          special_requirements?: string | null
          updated_at?: string
          user_id: string
          volunteer_type?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          place_name?: string
          provides_accommodation?: boolean | null
          provides_meals?: boolean | null
          region?: Database["public"]["Enums"]["region"] | null
          special_requirements?: string | null
          updated_at?: string
          user_id?: string
          volunteer_type?: string | null
        }
        Relationships: []
      }
      host_work_profiles: {
        Row: {
          available_dates: string[] | null
          city: string | null
          created_at: string
          gender_preference:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id: string
          is_permanent: boolean | null
          job_description: string | null
          payment: string | null
          place_name: string
          region: Database["public"]["Enums"]["region"] | null
          special_requirements: string | null
          team_size: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_dates?: string[] | null
          city?: string | null
          created_at?: string
          gender_preference?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id?: string
          is_permanent?: boolean | null
          job_description?: string | null
          payment?: string | null
          place_name: string
          region?: Database["public"]["Enums"]["region"] | null
          special_requirements?: string | null
          team_size?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_dates?: string[] | null
          city?: string | null
          created_at?: string
          gender_preference?:
            | Database["public"]["Enums"]["gender_preference"]
            | null
          id?: string
          is_permanent?: boolean | null
          job_description?: string | null
          payment?: string | null
          place_name?: string
          region?: Database["public"]["Enums"]["region"] | null
          special_requirements?: string | null
          team_size?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          id_document_url: string | null
          phone: string
          recommender_name: string
          recommender_phone: string
          registration_status: Database["public"]["Enums"]["registration_status"]
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          id_document_url?: string | null
          phone: string
          recommender_name: string
          recommender_phone: string
          registration_status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          id_document_url?: string | null
          phone?: string
          recommender_name?: string
          recommender_phone?: string
          registration_status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      ratings: {
        Row: {
          atmosphere_rating: number
          booking_id: string
          comment: string | null
          created_at: string
          food_rating: number
          hospitality_rating: number
          id: string
          reviewed_user_id: string
          reviewer_user_id: string
        }
        Insert: {
          atmosphere_rating: number
          booking_id: string
          comment?: string | null
          created_at?: string
          food_rating: number
          hospitality_rating: number
          id?: string
          reviewed_user_id: string
          reviewer_user_id: string
        }
        Update: {
          atmosphere_rating?: number
          booking_id?: string
          comment?: string | null
          created_at?: string
          food_rating?: number
          hospitality_rating?: number
          id?: string
          reviewed_user_id?: string
          reviewer_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      single_profiles: {
        Row: {
          about_me: string | null
          age: number | null
          city: string | null
          created_at: string
          gender: Database["public"]["Enums"]["gender_preference"] | null
          id: string
          region: Database["public"]["Enums"]["region"] | null
          religious_level: Database["public"]["Enums"]["religious_level"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          about_me?: string | null
          age?: number | null
          city?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_preference"] | null
          id?: string
          region?: Database["public"]["Enums"]["region"] | null
          religious_level?:
            | Database["public"]["Enums"]["religious_level"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          about_me?: string | null
          age?: number | null
          city?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_preference"] | null
          id?: string
          region?: Database["public"]["Enums"]["region"] | null
          religious_level?:
            | Database["public"]["Enums"]["religious_level"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      gender_preference: "men" | "women" | "mixed"
      host_type: "family" | "work" | "volunteer"
      region:
        | "north"
        | "haifa"
        | "sharon"
        | "center"
        | "tel_aviv"
        | "jerusalem"
        | "shfela"
        | "south"
        | "judea_samaria"
      registration_status: "pending" | "approved" | "rejected"
      religious_level:
        | "secular"
        | "traditional"
        | "religious"
        | "ultra_orthodox"
        | "other"
      user_type: "single" | "host"
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
    Enums: {
      app_role: ["admin", "user"],
      gender_preference: ["men", "women", "mixed"],
      host_type: ["family", "work", "volunteer"],
      region: [
        "north",
        "haifa",
        "sharon",
        "center",
        "tel_aviv",
        "jerusalem",
        "shfela",
        "south",
        "judea_samaria",
      ],
      registration_status: ["pending", "approved", "rejected"],
      religious_level: [
        "secular",
        "traditional",
        "religious",
        "ultra_orthodox",
        "other",
      ],
      user_type: ["single", "host"],
    },
  },
} as const
