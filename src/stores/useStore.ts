import { Store } from '@/@types/Store';
import { create } from 'zustand';

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;

  // ações
  setStores: (items: Store[]) => void;
  addStore: (item: Store) => void;
  updateStore: (id: string, data: Partial<Omit<Store, 'id'>>) => void;
  removeStore: (id: string) => void;

  // agora aceita Store | null:
  setSelectedStore: (store: Store | null) => void;

  // helpers
  getAvailable: () => Store[];
  getAvailableCount: () => number;
  getCities: () => string[];
  findByCity: (city: string) => Store[];
}

export const useStore = create<StoreState>((set, get) => ({
  stores: [],
  selectedStore: null,

  setStores: (items) => set({ stores: items }),

  addStore: (item) =>
    set((state) => ({ stores: [...state.stores, item] })),

  updateStore: (id, data) =>
    set((state) => ({
      stores: state.stores.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),

  removeStore: (id) =>
    set((state) => ({
      stores: state.stores.filter((s) => s.id !== id),
    })),

  // aceitar `null` aqui resolve o TypeScript error:
  setSelectedStore: (store) => set({ selectedStore: store }),

  getAvailable: () => get().stores.filter((s: Store) => s.available),
  
  getAvailableCount: () => get().stores.length,

  getCities: () =>
    get().stores.map((s) => s.city).filter((c, i, a) => a.indexOf(c) === i),

  findByCity: (city) => get().stores.filter((s) => s.city === city),
}));
