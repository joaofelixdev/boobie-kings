'use client'

import Image from 'next/image'
import bkBoobieGoods from '@/../public/images/bk-boobie-goods.png'
import { useStore } from '../stores/useStore'
import { Fredoka } from 'next/font/google';
import Link from 'next/link';

import me from '@/../public/images/me.webp'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const fredoka = Fredoka({
    variable: "--font-fredoka",
    subsets: ["latin"],
});

export default function Header() {
    const availableCount = useStore((state) => state.getAvailableCount());
    const updatedAt = useStore((state) => state.getUpdatedAt());

    return (
        <header
            className='container mx-auto w-full min-h-[100px] flex flex-col md:flex-row justify-between items-center px-4'
        >
            <div className='flex flex-col md:flex-row gap-6 items-center'>
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
            </div>
            <Link
                href="https://joaofelix.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex gap-2 rounded-full items-self-end mt-6 md:mt-0 md:mr-10 pr-2 pl-6 py-2
                hover:bg-gray-100 transition-all duration-200 ease-in-out text-gray-500 font-semibold gap-x-2
                hover:scale-105 hover:-mt-2 border-1 border-gray-200 md:border-0"
            >
                <div className='flex flex-col items-end -space-y-1'>
                    <span className='text-[.6rem]'>desenvolvido por</span>
                    <span className='text-md'>joaofelix.dev</span>
                </div>
                <Avatar>
                    <AvatarImage src="/images/me.webp" />
                    <AvatarFallback>JF</AvatarFallback>
                </Avatar>
            </Link>
        </header>
    )
}