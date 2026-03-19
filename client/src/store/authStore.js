import { create } from 'zustand';

const stored = localStorage.getItem('halleyx_user');
let initial = null;
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    // Invalidate old sessions that don't have a token
    initial = parsed?.token ? parsed : null;
    if (!initial) localStorage.removeItem('halleyx_user');
  } catch (_) {
    localStorage.removeItem('halleyx_user');
  }
}

const useAuthStore = create((set) => ({
  user: initial,

  setUser: (user) => {
    localStorage.setItem('halleyx_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('halleyx_user');
    set({ user: null });
  },
}));

export default useAuthStore;
