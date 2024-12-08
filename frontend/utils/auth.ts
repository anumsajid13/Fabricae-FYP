
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
