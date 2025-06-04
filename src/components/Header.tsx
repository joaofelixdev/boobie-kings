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
    const updatedAt = useStore((state) => state.getUpdatedAt());

    return (
        <header
            className='container mx-auto w-full min-h-[100px] flex flex-col md:flex-row gap-6 items-center'
        >
            <Image
                src={bkBoobieGoods}
                alt="Boobie Goods"
                width={100}
                height={100}
            />
            <div className='flex flex-col items-center md:items-start'>
                <h1
                    className={`text-xl md:text-3xl font-semibold ${fredoka.className}`}
                >
                    Encontre a loja mais próxima de você!
                </h1>
                <p className="text-md text-gray-800">
                    São {availableCount} lojas parceiras disponíveis.
                </p>
                {updatedAt && (
                    <p className="mt-1 text-[.8rem] text-gray-500">
                        Atualizado em {updatedAt}
                    </p>
                )}
            </div>
        </header>
    )
}