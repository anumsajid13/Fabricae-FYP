import { supabase } from '../lib/supabaseClient';
import React, { useState } from "react";
import { useAuthStore } from '../app/store/authStore'; 

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

  console.log('Token:', session.access_token); 
  console.log('Name:', session.user.user_metadata?.full_name);
  console.log('Picture:', session.user.user_metadata?.avatar_url); 
  console.log('Email:', session.user.email);


  return {
    token: session.access_token, 
    name: session.user.user_metadata?.full_name,
    picture: session.user.user_metadata?.avatar_url,
    email: session.user.email,
  };
};
