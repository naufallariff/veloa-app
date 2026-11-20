// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl!, supabasePublishableKey!, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false,
        },
    })
    : null;

/**
 * Mengonversi username standar (misal: "naufal_dev") menjadi format email internal
 * agar pengguna cukup login memakai Username + Password tanpa perlu input email.
 */
export function usernameToInternalEmail(username: string): string {
    const sanitized = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    return `${sanitized}@veloa.local`;
}