'use client'

import Image from 'next/image'

import bkBoobieGoods from '@/../public/images/bk-boobie-goods.png'

import { useStore } from '../stores/useStore'
import { Fredoka } from 'next/font/google';


const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"],
});

export default function Header() {
    const availableCount = useStore((state) => state.getAvailableCount());

    return (
        <header
            className='container mx-auto w-full h-[100px] flex gap-6 items-center font-inter'
        >
            <Image
                src={bkBoobieGoods}
                alt="Boobie Goods"
                width={100}
                height={100}
            />
            <div>
                <h1
                    className={`text-xl md:text-3xl font-semibold ${fredoka.className}`}
                >
                    Encontre a loja mais próxima de você!
                </h1>
                <p className="text-sm text-gray-500">
                    São {availableCount} lojas parceiras disponíveis.
                </p>
            </div>
        </header>
    )
}