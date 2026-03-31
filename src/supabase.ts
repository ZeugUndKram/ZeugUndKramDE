// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tjfdxvzymlhoaamxqxqe.supabase.co'
const supabaseAnonKey = 'sb_publishable_jMTBhGdLq9vI5062b6C-FA_Uzd8W-Zz'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)