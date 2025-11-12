import { create } from 'zustand';


export const useModalStore = create((set) => ({
  isOpen: false,
  meal: null,
  openModal: (meal) => set({ isOpen: true, meal }),
  closeModal: () => set({ isOpen: false, meal: null }),
}));
