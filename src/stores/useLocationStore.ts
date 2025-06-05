import { create } from "zustand";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  setLocation: (lat, lng) =>
    set({
      latitude: lat,
      longitude: lng,
    }),
}));
