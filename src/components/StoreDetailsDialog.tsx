'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import Image from 'next/image';
import { BanIcon, CheckIcon, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from './ui/badge';

import logoGoogleMaps from '@/../public/images/icon-google-maps.svg';
import logoUber from '@/../public/images/icons-uber.svg';
import logoWaze from '@/../public/images/icons-waze.svg';
import { Inter, Fredoka } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const fredoka = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
});

export default function StoreDetailsDialog() {
  const store = useStore((s) => s.selectedStore);
  const setSelectedStore = useStore((s) => s.setSelectedStore);

  // Detecta se é dispositivo mobile via largura de tela
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Controla abertura/fechamento do Dialog
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isMobile && store) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isMobile, store]);

  const encode = (address: string) => encodeURIComponent(address);

  if (!isMobile) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSelectedStore(null);
        }
      }}
    >
      <DialogContent className="w-11/12 max-w-md p-6 rounded-lg border-2 border-black">
        <DialogHeader>
          <DialogTitle
            className={`${fredoka.className} text-2xl text-center break-words`}
          >
            {store ? store.name : 'Loja não encontrada'}
          </DialogTitle>

          {/*
            → Aqui: forçamos o DialogDescription a renderizar como <div>,
            usando a prop `asChild`. Dentro dele, todo o conteúdo fica num <div>.
          */}
          <DialogDescription asChild>
            <div>
              {store ? (
                <div className='flex flex-col'>
                  {/* Endereço e cidade */}
                  <span className={`${inter.className} text-lg break-words`}>
                    {store.address}
                  </span>
                  <span className={`${inter.className} text-sm`}>
                    {store.city + ', ' + store.zip}
                  </span>
                </div>
              ) : (
                <div className={`${inter.className} text-lg break-words`}>
                  Loja não encontrada
                </div>
              )}
            </div>
          </DialogDescription>

          <hr className="my-4 border-gray-300" />

          {/* Como chegar */}
          <div>
            <h3 className={`${fredoka.className} text-md`}>Como chegar</h3>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encode(
                  `${store?.address}, ${store?.city}, ${store?.zip}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 border-2 border-black rounded-lg hover:bg-gray-100 transition"
              >
                <Image
                  src={logoGoogleMaps}
                  alt="Google Maps"
                  width={30}
                  height={30}
                  className="inline-block"
                />
              </a>
              <a
                href={`https://waze.com/ul?navigate=yes&q=${encode(
                  `${store?.address}, ${store?.city}, ${store?.zip}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 border-2 border-black rounded-lg hover:bg-gray-100 transition"
              >
                <Image
                  src={logoWaze}
                  alt="Waze"
                  width={30}
                  height={30}
                  className="inline-block"
                />
              </a>
              <a
                href={`https://m.uber.com/ul?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encode(
                  `${store?.address}, ${store?.city}, ${store?.zip}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center p-2 border-2 border-black rounded-lg hover:bg-gray-100 transition"
              >
                <Image
                  src={logoUber}
                  alt="Uber"
                  width={30}
                  height={30}
                  className="inline-block"
                />
              </a>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Status e badges */}
          <div className="flex gap-2">
            {store?.available ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-emerald-400 text-white"
              >
                <CheckIcon size={12} aria-hidden="true" />
                Disponível
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-red-700 text-white"
              >
                <BanIcon size={12} aria-hidden="true" />
                Esgotado
              </Badge>
            )}

            {store?.available && store?.kit && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-fuchsia-500 text-white"
              >
                <Palette size={12} aria-hidden="true" />
                Kit Faber Castel
              </Badge>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
