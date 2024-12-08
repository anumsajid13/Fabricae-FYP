import { supabase } from '../lib/supabaseClient';

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error('Error with Google Sign-In:', error.message);
    return { error };
  }

  return { success: true };
};

export const signInWithLinkedIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
  });

  if (error) {
    console.error('Error with LinkedIn Sign-In:', error.message);
    return { error };
  }

  return { success: true };
};

export const getUserProfile = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    console.error('Error fetching session:', error?.message || 'No session found');
    return null;
  }

  const session = data.session;

  return {
    token: session.access_token, // Access token from the session
    name: session.user.user_metadata?.full_name,
    picture: session.user.user_metadata?.avatar_url,
    email: session.user.email,
  };
};
