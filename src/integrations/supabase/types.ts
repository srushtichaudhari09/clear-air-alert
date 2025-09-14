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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          location_id: string
          model_version: string | null
          predicted_aqi: number | null
          predicted_bucket: string | null
          predicted_for: string
          weather_factors: Json | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          location_id: string
          model_version?: string | null
          predicted_aqi?: number | null
          predicted_bucket?: string | null
          predicted_for: string
          weather_factors?: Json | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          location_id?: string
          model_version?: string | null
          predicted_aqi?: number | null
          predicted_bucket?: string | null
          predicted_for?: string
          weather_factors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      air_quality_readings: {
        Row: {
          avg_value: number | null
          created_at: string
          data_source: string | null
          id: string
          max_value: number | null
          measured_at: string
          min_value: number | null
          pollutant_id: string
          station_id: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          avg_value?: number | null
          created_at?: string
          data_source?: string | null
          id?: string
          max_value?: number | null
          measured_at: string
          min_value?: number | null
          pollutant_id: string
          station_id: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          avg_value?: number | null
          created_at?: string
          data_source?: string | null
          id?: string
          max_value?: number | null
          measured_at?: string
          min_value?: number | null
          pollutant_id?: string
          station_id?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "air_quality_readings_pollutant_id_fkey"
            columns: ["pollutant_id"]
            isOneToOne: false
            referencedRelation: "pollutants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "air_quality_readings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      air_quality_summary: {
        Row: {
          aqi: number | null
          aqi_bucket_id: string | null
          benzene: number | null
          co: number | null
          created_at: string
          data_source: string | null
          dominant_pollutant: string | null
          humidity: number | null
          id: string
          location_id: string
          measured_at: string
          nh3: number | null
          no: number | null
          no2: number | null
          nox: number | null
          o3: number | null
          pm10: number | null
          pm25: number | null
          so2: number | null
          station_id: string
          summary_type: string | null
          temperature: number | null
          toluene: number | null
          updated_at: string
          wind_direction: string | null
          wind_speed: number | null
          xylene: number | null
        }
        Insert: {
          aqi?: number | null
          aqi_bucket_id?: string | null
          benzene?: number | null
          co?: number | null
          created_at?: string
          data_source?: string | null
          dominant_pollutant?: string | null
          humidity?: number | null
          id?: string
          location_id: string
          measured_at: string
          nh3?: number | null
          no?: number | null
          no2?: number | null
          nox?: number | null
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
          so2?: number | null
          station_id: string
          summary_type?: string | null
          temperature?: number | null
          toluene?: number | null
          updated_at?: string
          wind_direction?: string | null
          wind_speed?: number | null
          xylene?: number | null
        }
        Update: {
          aqi?: number | null
          aqi_bucket_id?: string | null
          benzene?: number | null
          co?: number | null
          created_at?: string
          data_source?: string | null
          dominant_pollutant?: string | null
          humidity?: number | null
          id?: string
          location_id?: string
          measured_at?: string
          nh3?: number | null
          no?: number | null
          no2?: number | null
          nox?: number | null
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
          so2?: number | null
          station_id?: string
          summary_type?: string | null
          temperature?: number | null
          toluene?: number | null
          updated_at?: string
          wind_direction?: string | null
          wind_speed?: number | null
          xylene?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "air_quality_summary_aqi_bucket_id_fkey"
            columns: ["aqi_bucket_id"]
            isOneToOne: false
            referencedRelation: "aqi_buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "air_quality_summary_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "air_quality_summary_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      aqi_buckets: {
        Row: {
          color_code: string | null
          created_at: string
          health_message: string | null
          id: string
          max_aqi: number
          min_aqi: number
          name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          health_message?: string | null
          id?: string
          max_aqi: number
          min_aqi: number
          name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          health_message?: string | null
          id?: string
          max_aqi?: number
          min_aqi?: number
          name?: string
        }
        Relationships: []
      }
      health_alerts: {
        Row: {
          alert_type: string
          aqi_value: number | null
          created_at: string
          dominant_pollutant: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          location_id: string
          message: string
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          aqi_value?: number | null
          created_at?: string
          dominant_pollutant?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          location_id: string
          message: string
          severity: string
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          aqi_value?: number | null
          created_at?: string
          dominant_pollutant?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          location_id?: string
          message?: string
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      pollutants: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          unit: string | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          unit?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          unit?: string | null
        }
        Relationships: []
      }
      stations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          location_id: string
          longitude: number | null
          station_code: string | null
          station_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location_id: string
          longitude?: number | null
          station_code?: string | null
          station_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location_id?: string
          longitude?: number | null
          station_code?: string | null
          station_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          created_at: string
          full_name: string | null
          health_conditions: string[] | null
          id: string
          notification_preferences: Json | null
          preferred_location_id: string | null
          sensitivity_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          full_name?: string | null
          health_conditions?: string[] | null
          id?: string
          notification_preferences?: Json | null
          preferred_location_id?: string | null
          sensitivity_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          created_at?: string
          full_name?: string | null
          health_conditions?: string[] | null
          id?: string
          notification_preferences?: Json | null
          preferred_location_id?: string | null
          sensitivity_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_preferred_location_id_fkey"
            columns: ["preferred_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
