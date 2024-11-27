// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjjvhfjwzxorwavtwckv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqanZoZmp3enhvcndhdnR3Y2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3MjgzMDcsImV4cCI6MjA0ODMwNDMwN30.itSkIFvoCjXHxuzNWY51tgnBaJJIUqz_GxXVs_8SCKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
