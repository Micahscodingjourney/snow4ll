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
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          skill_level: string | null
          total_distance: number | null
          total_ride_time: number | null
          top_speed: number | null
          total_photos: number | null
          level: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          skill_level?: string | null
          total_distance?: number | null
          total_ride_time?: number | null
          top_speed?: number | null
          total_photos?: number | null
          level?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          skill_level?: string | null
          total_distance?: number | null
          total_ride_time?: number | null
          top_speed?: number | null
          total_photos?: number | null
          level?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rides: {
        Row: {
          id: string
          user_id: string
          title: string
          location: string
          start_time: string
          end_time: string | null
          duration: number | null
          distance: number | null
          top_speed: number | null
          avg_speed: number | null
          elevation_gain: number | null
          gps_data: Json | null
          weather_conditions: Json | null
          is_active: boolean | null
          is_public: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          location: string
          start_time: string
          end_time?: string | null
          duration?: number | null
          distance?: number | null
          top_speed?: number | null
          avg_speed?: number | null
          elevation_gain?: number | null
          gps_data?: Json | null
          weather_conditions?: Json | null
          is_active?: boolean | null
          is_public?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          location?: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          distance?: number | null
          top_speed?: number | null
          avg_speed?: number | null
          elevation_gain?: number | null
          gps_data?: Json | null
          weather_conditions?: Json | null
          is_active?: boolean | null
          is_public?: boolean | null
          created_at?: string | null
        }
      }
      ride_photos: {
        Row: {
          id: string
          user_id: string
          ride_id: string | null
          photo_url: string
          caption: string | null
          location: string | null
          gps_coordinates: unknown | null
          ride_data: Json | null
          likes_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ride_id?: string | null
          photo_url: string
          caption?: string | null
          location?: string | null
          gps_coordinates?: unknown | null
          ride_data?: Json | null
          likes_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ride_id?: string | null
          photo_url?: string
          caption?: string | null
          location?: string | null
          gps_coordinates?: unknown | null
          ride_data?: Json | null
          likes_count?: number | null
          created_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          channel: string
          message: string
          message_type: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          channel?: string
          message: string
          message_type?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          channel?: string
          message?: string
          message_type?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string | null
          created_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          icon: string
          progress: number | null
          target: number
          unlocked: boolean | null
          unlocked_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          title: string
          description: string
          icon: string
          progress?: number | null
          target: number
          unlocked?: boolean | null
          unlocked_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          title?: string
          description?: string
          icon?: string
          progress?: number | null
          target?: number
          unlocked?: boolean | null
          unlocked_at?: string | null
          created_at?: string | null
        }
      }
      weather_data: {
        Row: {
          id: string
          location: string
          elevation: number | null
          temperature: number | null
          condition: string | null
          wind_speed: number | null
          wind_direction: string | null
          humidity: number | null
          visibility: number | null
          snowfall: number | null
          forecast_data: Json | null
          cached_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          location: string
          elevation?: number | null
          temperature?: number | null
          condition?: string | null
          wind_speed?: number | null
          wind_direction?: string | null
          humidity?: number | null
          visibility?: number | null
          snowfall?: number | null
          forecast_data?: Json | null
          cached_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          location?: string
          elevation?: number | null
          temperature?: number | null
          condition?: string | null
          wind_speed?: number | null
          wind_direction?: string | null
          humidity?: number | null
          visibility?: number | null
          snowfall?: number | null
          forecast_data?: Json | null
          cached_at?: string | null
          expires_at?: string | null
        }
      }
      photo_likes: {
        Row: {
          id: string
          user_id: string
          photo_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          photo_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          photo_id?: string
          created_at?: string | null
        }
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