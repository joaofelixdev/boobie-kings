// components/List.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AArrowDown, AArrowUp } from "lucide-react";
import type { Store } from "@/@types/Store";
import { useStore } from "@/stores/useStore";
import { useLocationStore } from "@/stores/useLocationStore"; // hook do Zustand onde guardamos localização do usuário
import { haversineDistance } from "@/utils/distance";          // helper que implementa a fórmula de Haversine
import { SelectNative } from "./ui/select-native";
import { Fredoka } from "next/font/google";
import moment from "moment";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

interface Props {
  stores: Store[];
  updatedAt: string;
}

export default function List({ stores, updatedAt }: Props) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  // ações do Zustand para popular estado global
  const setStores = useStore((s) => s.setStores);
  const setSelectedStore = useStore((s) => s.setSelectedStore);
  const setUpdatedAt = useStore((s) => s.setUpdatedAt);

  // pegamos latitude/longitude do usuário (pode ser null se não permitiu ou ainda está carregando)
  const userLat = useLocationStore((s) => s.latitude);
  const userLng = useLocationStore((s) => s.longitude);

  // no efeito inicial, armazenamos as lojas e o updatedAt em Zustand
  useEffect(() => {
    setStores(stores);
    // converte updatedAt (string) para formato MM/DD/yyyy HH:mm
    setUpdatedAt(moment(updatedAt).format("MM/DD/yyyy HH:mm"));
  }, [stores, setStores, setUpdatedAt, updatedAt]);

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  // gera lista única de cidades
  const cities = useMemo(() => {
    const unique = Array.from(new Set(stores.map((s) => s.city)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [stores]);

  // ordena pela propriedade name
  const sortedStores = useMemo(() => {
    const arr = [...stores].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    return sortOrder === "asc" ? arr : arr.reverse();
  }, [stores, sortOrder]);

  // filtra por searchTerm e cidade
  const filteredStores = useMemo(() => {
    return sortedStores.filter((s) => {
      const matchesName = s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCity =
        selectedCity === "all" ? true : s.city === selectedCity;
      return matchesName && matchesCity;
    });
  }, [sortedStores, searchTerm, selectedCity]);

  // função auxiliar que, dado store e userLat/userLng, retorna string formatada de distância
  const formatDistance = (store: Store) => {
    if (
      userLat == null ||
      userLng == null ||
      store.lat == null ||
      store.lng == null
    ) {
      return null;
    }
    const distKm = haversineDistance(
      userLat,
      userLng,
      store.lat,
      store.lng,
    );
    if (distKm < 1) {
      // menos de 1 km → mostra em metros
      return `${Math.round(distKm * 1000)} m`;
    } else {
      // mostra em km com duas casas decimais
      return `${distKm.toFixed(2)} km`;
    }
  };

  return (
    <div className="w-full">
      {/* === FILTROS === */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2 w-full">
            <Button
              className="bg-[#0A447C] hover:bg-[#073562] cursor-pointer"
              onClick={toggleSort}
            >
              {sortOrder === "asc" ? <AArrowDown /> : <AArrowUp />}
            </Button>

            <Input
              placeholder="Digite o nome da loja..."
              className={`flex-1 border-2 border-black ${fredoka.className} w-[400px] focus-visible:ring-0 focus-visible:border-black`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <SelectNative
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`border-2 border-black md:w-[200px] focus-visible:ring-0 focus-visible:border-black text-md ${fredoka.className}`}
          >
            <option value="all">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </SelectNative>
        </div>
      </div>

      {/* === LISTA DE LOJAS === */}
      <div className="mt-4 space-y-4">
        {filteredStores.map((store) => {
          const distanceText = formatDistance(store);

          return (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="w-full min-h-[100px] bg-gray-100/40 hover:bg-gray-200/80
                rounded-lg px-6 py-4 transition-all duration-500 cursor-pointer
                flex justify-between items-center gap-4 border-2 border-black hover:scale-102"
            >
              <div className="flex-1">
                <span className={`${fredoka.className} text-xl`}>
                  {store.name}
                </span>
                <p className="text-sm">{store.address}</p>
                <p className="text-sm">{store.city}</p>
              </div>
              {/* Se distanceText existir, exibe abaixo */}
              {distanceText && (
                <div>
                  <p className="text-2xl font-semibold text-gray-700">
                    {distanceText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
