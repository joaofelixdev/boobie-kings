'use client'

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollTop() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        showButton && (
            <button
                className="fixed bottom-4 right-4 bg-[#0A447C] hover:bg-[#073562]
                text-white p-2 rounded-full shadow-lg cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <ArrowUp />
            </button>
        )
    );
}