'use client'

import { useStore } from '@/stores/useStore'
import { fredoka, inter } from '@/app/layout'
import Image from 'next/image'
import { BanIcon, CheckIcon, Palette, StoreIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import logoGoogleMaps from '@/../public/images/icon-google-maps.svg'
import logoUber from '@/../public/images/icons-uber.svg'
import logoWaze from '@/../public/images/icons-waze.svg'
import { Badge } from './ui/badge'

export default function StoreDetails() {
  const store = useStore((s) => s.selectedStore)

  const encode = (address: string) => encodeURIComponent(address)

  // URL builders:
  const destination = store ? `${store.address}, ${store.city}, ${store.zip}` : ''
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encode(destination)}`
  const wazeUrl = `https://waze.com/ul?navigate=yes&q=${encode(destination)}`
  const uberUrl =
    `https://m.uber.com/ul?` +
    `action=setPickup` +
    `&pickup=my_location` +
    `&dropoff[formatted_address]=${encode(destination)}`

  // Framer Motion variants para animação de flip
  const variants = {
    initial: { rotateY: 90, opacity: 0, transition: { duration: 0.3 } },
    animate: { rotateY: 0, opacity: 1, transition: { duration: 0.6 } },
    exit: { rotateY: -90, opacity: 0, transition: { duration: 0.1 } },
  }

  return (
    <div className="relative w-full min-h-[400px] perspective-[1200px]">
      <AnimatePresence mode="wait">
        {store ? (
          <motion.div
            key={store.id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full border-2 border-black rounded-lg p-6 bg-white overflow-hidden backface-hidden"
          >
            <h2 className={`${fredoka.className} text-5xl break-words whitespace-normal`}>
              {store.name}
            </h2>
            <p className={`${inter.className} text-lg mt-6 break-words`}>
              {store.address}
            </p>
            <p className={`${inter.className} text-sm`}>
              {store.city + ', ' + store.zip}
            </p>
            {/* {store.lat && store.lng && (
              <p className={`${inter.className} text-sm`}>
                Coordenadas: {store.lat}, {store.lng}
              </p>
            )} */}

            <hr className='my-6' />

            <div>
              <h3 className={`${fredoka.className} text-md`}>Como chegar</h3>
              <div className="flex gap-2 mt-2">
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center p-2 border-black rounded-lg hover:bg-gray-100 transition"
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
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center p-2 border-black rounded-lg hover:bg-gray-100 transition"
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
                  href={uberUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center p-2 border-black rounded-lg hover:bg-gray-100 transition"
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

            <hr className='my-6' />

            <div className='flex gap-1'>
              {(store.available) ? (
                <Badge variant="outline" className="gap-1 bg-emerald-400 text-white">
                  <CheckIcon size={12} aria-hidden="true" />
                  Disponível
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 bg-red-700 text-white">
                  <BanIcon size={12} aria-hidden="true" />
                  Esgotado
                </Badge>
              )}

              {(store.available && store.kit) && (
                <Badge variant="outline" className="gap-1 bg-fuchsia-500 text-white">
                  <Palette size={12} aria-hidden="true" />
                  Kit Faber Castel
                </Badge>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full min-h-[400px] border-2 border-black rounded-lg p-4 flex flex-col items-center justify-center bg-white overflow-hidden backface-hidden"
          >
            <StoreIcon size={150} strokeWidth={1} className="mt-4" />
            <span className={`${fredoka.className} text-xl break-words whitespace-normal`}>
              Selecione uma loja
            </span>
            <p className={`${inter.className} text-xs`}>Para ver os detalhes</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
