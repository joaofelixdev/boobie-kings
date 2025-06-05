// utils/geocodeStores.ts
import { Store } from '@/@types/Store';

interface NominatimResult {
  lat: string;
  lon: string;
}

const GEOCODE_BASE_URL = 'https://nominatim.openstreetmap.org/search';

function buildFullAddress(store: Store): string {
  const partes: string[] = [];
  if (store.address) partes.push(store.address);
  if (store.city) partes.push(store.city);
  if (store.zip) partes.push(store.zip);
  return partes.join(', ');
}

async function geocodeAddress(fullAddress: string): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(fullAddress);
  const url = `${GEOCODE_BASE_URL}?format=json&limit=1&q=${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BoobieKing/1.0 (felixl.joao@gmail.com)'
      }
    });
    if (!res.ok) return null;

    const data: NominatimResult[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };
    }
    return null;
  } catch (err) {
    console.error('[geocodeStores] Erro ao chamar Nominatim:', err);
    return null;
  }
}

/**
 * Para cada loja, monta o fullAddress e busca { lat, lng } via Nominatim.
 * Respeita um delay entre chamadas para não violar rate-limit.
 *
 * @param stores Array original de Store
 * @returns Novo array de Store, onde cada item pode ter lat/lng (ou não, se não achou)
 */
export async function geocodeStores(stores: Store[]): Promise<Store[]> {
  const updatedStores: Store[] = [];

  for (const store of stores) {
    // Se o objeto já tiver lat/lng, só copia (permite reutilizar coords manualmente)
    if (typeof store.lat === 'number' && typeof store.lng === 'number') {
      updatedStores.push(store);
      continue;
    }

    const fullAddress = buildFullAddress(store);

    // Se não tiver endereço completo, pula
    if (!fullAddress) {
      updatedStores.push(store);
      continue;
    }

    const coords = await geocodeAddress(fullAddress);
    if (coords) {
      updatedStores.push({
        ...store,
        lat: coords.lat,
        lng: coords.lng,
      });
    } else {
      // Não encontrou coords: adiciona store sem alteração
      updatedStores.push(store);
    }

    // Aguarda 1 segundo antes da próxima chamada
    await new Promise((r) => setTimeout(r, 1000));
  }

  return updatedStores;
}
