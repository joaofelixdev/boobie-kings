// Removed unused import 'Header'
import { Store } from "@/@types/Store";
import List from "@/components/List";
import fs from 'fs'
import path from "path";
import StoreDetails from "@/components/StoreDetails";
import StoreDetailsDialog from "@/components/StoreDetailsDialog";

export default async function Home() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'stores.json')
  const json = fs.readFileSync(filePath, 'utf-8')
  const stores: Store[] = JSON.parse(json)  

  return (
    <div className="container mx-auto">
      <section className="w-full flex gap-4 px-8 mt-10">
        {/* Coluna da esquerda: lista */}
        <div className="flex-1 w-2/3">
          <List stores={stores} />
        </div>

        {/* Coluna da direita: painel de detalhes */}
        <div className="w-1/3 p-4 hidden md:block">
          <div className="sticky top-16">
            <StoreDetails />
          </div>
        </div>

        {/* Dialog para mobile */}
        <div className="md:hidden">
            <StoreDetailsDialog />
        </div>
      </section>
    </div>
  );
}
