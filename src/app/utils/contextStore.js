import { create } from 'zustand';


export const useModalStore = create((set) => ({
  isOpen: false,
  meal: null,
  openModal: (meal) => set({ isOpen: true, meal }),
  closeModal: () => set({ isOpen: false, meal: null }),
}));

export const useFilterStore = create((set) => ({
  filterActive: false,
  mealLocations: [],
  mealAdditives: [],
  mealProteins: [],
  setFilterActive: (filterActive) => set({ filterActive }),
  setMealLocations: (mealLocations) => set({ mealLocations }), 
  setMealAdditives: (mealAdditives) => set({ mealAdditives }), 
  setMealProteins: (mealProteins) => set({ mealProteins }), 
}));

export const useSettingsStore = create((set) => ({ 
}));