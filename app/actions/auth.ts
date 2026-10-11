"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign up a new user with email, password, and full name.
 * The Supabase trigger automatically creates a profiles row.
 */
export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    if (!email || !password || !fullName) {
      return { error: "All fields are required." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Please enter a valid email address." };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: "Check your email for a confirmation link!" };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Sign in an existing user with email + password.
 * On success, revalidates the layout cache and redirects to home.
 */
export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Please enter a valid email address." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
  redirect("/");
}

/**
 * Sign out the current user and redirect to the login page.
 */
export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("Sign out error", err);
  }
  redirect("/login");
}

/**
 * Fetch the current user's profile from the profiles table.
 * Returns null if not authenticated or profile doesn't exist.
 */
export async function getProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile", profileError.message);
    }

    return { user, profile };
  } catch (err) {
    console.error("Error fetching profile", err);
    return { user: null, profile: null };
  }
}

/**
 * Update the current user's profile (full_name, avatar_url).
 */
export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated." };
    }

    const fullName = formData.get("fullName") as string;

    if (!fullName) {
      return { error: "Full name is required." };
    }

    // Update the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      return { error: profileError.message };
    }

    // Also update user_metadata for consistency (used by UserNav)
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (metaError) {
      return { error: metaError.message };
    }

    revalidatePath("/", "layout");
    return { success: "Profile updated successfully!" };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
