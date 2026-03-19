import { create } from 'zustand';

const stored = localStorage.getItem('halleyx_user');
const initial = stored ? JSON.parse(stored) : null;

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
