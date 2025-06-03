// /app/api/lojas/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { promises as fs } from 'fs';
import path from 'path';
import { Store } from '@/@types/Store';

// Removemos o runtime: 'edge' para permitir uso de fs
// export const config = { runtime: 'edge' };

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
    const storesArray = rows
      .map((row) => {
        if (row.length < 6) return null;

        const rawNameField = row[1]?.trim() ?? '';
        const [namePart] = rawNameField.split(/\s*-\s*/);
        const name = namePart.trim();
        if (!name) return null;

        const address = row[2]?.trim() ?? '';
        const city = row[3]?.trim() ?? '';
        const zip = row[4]?.trim() ?? '';
        const availabilityRaw = row[5]?.trim().toLowerCase() ?? '';

        console.log(availabilityRaw);

        const available = availabilityRaw === 'disponível';
        const id = normalizeId(name, address, zip);

        const obj: Store = {
          id,
          name,
          address,
          city,
          zip,
          available,
        };
        return obj;
      })
      .filter((x) => x !== null) as Store[];

    // 2) Prepara o JSON final, inserindo metadata.updated_at e data
    const nowIso = new Date().toISOString();
    const output = {
      metadata: {
        updated_at: nowIso,
      },
      data: storesArray,
    };

    // 3) Converte para string JSON com indentação
    const jsonString = JSON.stringify(output, null, 2);

    // 4) Garante que a pasta 'public/data' exista
    const targetDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(targetDir, { recursive: true });

    // 5) Caminho completo do arquivo stores.json
    const filePath = path.join(targetDir, 'stores.json');

    // 6) Grava o JSON em disco
    await fs.writeFile(filePath, jsonString, 'utf8');

    // 7) Retorna a estrutura escrita (ou apenas uma mensagem de sucesso)
    return NextResponse.json(
      { message: 'stores.json salvo em public/data com sucesso', metadata: { updated_at: nowIso } },
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
