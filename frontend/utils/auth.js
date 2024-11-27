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
