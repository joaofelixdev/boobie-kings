"use client"

import { useState, useMemo, useEffect } from "react"
import { fredoka } from "@/app/layout"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { AArrowDown, AArrowUp } from "lucide-react"
import type { Store } from "@/@types/Store"
import { useStore } from "@/stores/useStore"
import { SelectNative } from "./ui/select-native"

interface Props {
  stores: Store[]
}

export default function List({ stores }: Props) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")

  const setStores = useStore((s) => s.setStores);
  const setSelectedStore = useStore((s) => s.setSelectedStore)

  useEffect(() => {
    setStores(stores);
  }, [stores, setStores]);

  const toggleSort = () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))

  // Gera lista de cidades únicas ordenadas
  const cities = useMemo(() => {
    const unique = Array.from(new Set(stores.map((s) => s.city)))
    return unique.sort((a, b) => a.localeCompare(b))
  }, [stores])

  // Ordena as lojas por nome
  const sortedStores = useMemo(() => {
    const arr = [...stores].sort((a, b) => a.name.localeCompare(b.name))
    return sortOrder === "asc" ? arr : arr.reverse()
  }, [stores, sortOrder])

  // Filtra por termo e cidade
  const filteredStores = useMemo(() => {
    return sortedStores.filter((s) => {
      const matchesName = s.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = selectedCity === "all" ? true : s.city === selectedCity
      return matchesName && matchesCity
    })
  }, [sortedStores, searchTerm, selectedCity])

  return (
    <div className="w-full">
      {/* Filtros */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-2 w-full">
            <Button className="bg-[#0A447C] hover:bg-[#073562] cursor-pointer" onClick={toggleSort}>
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

      {/* Lista de lojas */}
      <div className="mt-4 space-y-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            onClick={() => setSelectedStore(store)}
            className="w-full min-h-[100px] bg-gray-100/40 hover:bg-gray-200
              rounded-lg px-6 py-4 transition-colors duration-500 cursor-pointer
              flex justify-between items-center gap-4 border-2 border-black"
          >
            <div className="flex-1">
              <span className={`${fredoka.className} text-xl`}>{store.name}</span>
              <p className="text-sm">{store.address}</p>
              <p className="text-sm">{store.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
