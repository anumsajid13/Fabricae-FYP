import {create} from 'zustand';

// Declare the AuthState interface to define the store's shape
interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  getToken: () => string | null;
}

// Create the store and ensure the type is applied to the Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Default state is null (not authenticated)
  setToken: (token) => {
    set({ token });
    // Store the token in localStorage as well
    localStorage.setItem('authToken', token);
  },
  removeToken: () => {
    set({ token: null });
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('sb-vjjvhfjwzxorwavtwckv-auth-token');

  },
  getToken: () => {
    return localStorage.getItem('authToken');
  },
}));
