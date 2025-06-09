import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { promises as fs } from 'fs';
import path from 'path';
import { Store } from '@/@types/Store';

// IMPORTA a função de geocoding que criamos
import { geocodeStores } from '@/utils/geocodeStores';

// Define se deve executar a geocodificação ou não.
// Para ativar, adicione no .env.local: ENABLE_GEOCODING=true
const ENABLE_GEOCODING = process.env.ENABLE_GEOCODING === 'true';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não enviado. Use campo "file" no form-data.' },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const parsed = Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
    });
    const rows = parsed.data;

    /** 
     * Gera um slug único a partir de name + address + zip 
     */
    function normalizeId(name: string, address: string, zip: string) {
      const base = `${name} ${address}`;
      const noAcento = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const slugBase = noAcento
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const zipClean = zip.replace(/\D/g, '');
      return `${slugBase}-${zipClean}`;
    }

    // 1) Mapeia cada linha válida para um objeto Store
    let storesArray: Store[] = rows
      .map((row) => {
        if (row.length < 5) return null;

        const rawNameField = row[0]?.trim() ?? '';
        const [namePart] = rawNameField.split(/\s*-\s*/);
        const name = namePart.trim();
        if (!name) return null;

        const address = row[1]?.trim() ?? '';
        const city = row[2]?.trim() ?? '';
        const zip = row[3]?.trim() ?? '';
        const availabilityRaw = row[4]?.trim().toLowerCase() ?? '';

        const available = availabilityRaw !== 'esgotada';
        const id = normalizeId(name, address, zip);

        const obj: Store = {
          id,
          name,
          address,
          city,
          zip,
          available,
          // lat, lng e qualquer outro campo opcional começarão indefinidos
        };
        return obj;
      })
      .filter((x) => x !== null) as Store[];

    // 2) Se habilitado, geocodifica todas as lojas antes de montar o JSON final
    if (ENABLE_GEOCODING) {
      storesArray = await geocodeStores(storesArray);
      // Agora cada item de storesArray pode ter lat e lng (ou não, se falhar)
    }

    // 3) Prepara o JSON final, inserindo metadata.updated_at e data (com lat/lng)
    const nowIso = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const output = {
      metadata: {
        updated_at: nowIso,
        geocoded: ENABLE_GEOCODING, // opcional: indica no JSON se passamos pela geocodificação
      },
      data: storesArray,
    };

    // 4) Converte para string JSON com indentação
    const jsonString = JSON.stringify(output, null, 2);

    // 5) Garante que a pasta 'public/data' exista
    const targetDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(targetDir, { recursive: true });

    // 6) Caminho completo do arquivo stores.json
    const filePath = path.join(targetDir, 'stores.json');

    // 7) Grava o JSON em disco
    await fs.writeFile(filePath, jsonString, 'utf8');

    // 8) Retorna uma resposta (exibe se fez geocoding ou não)
    return NextResponse.json(
      {
        message: 'stores.json salvo em public/data com sucesso',
        metadata: {
          updated_at: nowIso,
          geocoded: ENABLE_GEOCODING,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Erro ao processar CSV:', err);
    return NextResponse.json(
      { error: 'Falha ao processar o arquivo CSV.' },
      { status: 500 }
    );
  }
}
