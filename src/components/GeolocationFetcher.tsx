"use client";

import { useEffect, useState } from "react";
import { useLocationStore } from "@/stores/useLocationStore";

export default function GeolocationFetcher() {
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {},
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setLocation]);

  return null;
}
