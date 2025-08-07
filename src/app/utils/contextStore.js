// store/modalStore.ts
import { create } from 'zustand';


export const useModalStore = create((set) => ({
  isOpen: false,
  meal: null,
  comments : null,
  images: null,
  openModal: (meal,comments,images) => set({ isOpen: true, meal, comments, images }),
  closeModal: () => set({ isOpen: false, meal: null }),
}));
