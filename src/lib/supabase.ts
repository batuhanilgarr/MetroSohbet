import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface MetroLine {
  id: string
  name: string
  display_name: string
  color: string
  is_active: boolean
  created_at: string
}

export interface ChatRoom {
  id: string
  line_id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Message {
  id: string
  room_id: string
  nickname: string
  content: string
  message_type: 'chat' | 'announcement' | 'lost_item' | 'crowd_level'
  is_anonymous: boolean
  created_at: string
  is_deleted?: boolean
  is_pinned?: boolean
  station_label?: string | null
}

export interface Report {
  id: string
  message_id: string
  reason: string
  reporter_nickname: string | null
  reporter_ip: string | null
  status: 'new' | 'reviewing' | 'closed'
  admin_notes: string | null
  assigned_admin: string | null
  reviewed_at: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

export interface CrossLineAnnouncement {
  id: string
  title: string
  content: string
  announcement_type: 'info' | 'warning' | 'error' | 'shutdown' | 'maintenance'
  priority: number
  is_active: boolean
  starts_at: string
  expires_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}
