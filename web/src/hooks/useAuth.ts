"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, updated_at")
        .eq("id", userId)
        .single();

      if (error) {
        // Profile table may not exist yet or row missing — fail silently
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    // IMPORTANT: Do NOT await Supabase queries inside this callback.
    // The callback runs while the auth lock is held, so any query that
    // needs the session token would deadlock waiting for the same lock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Fire profile fetch without blocking the callback
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.reload();
  }, []);

  return { user, profile, loading, signOut };
}
