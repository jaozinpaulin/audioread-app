'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, BookOpen, Headphones, Info, Upload } from 'lucide-react';

export default function Home() {
    const pathname = usePathname();

    const [documents] = useState([
        { id: '1', title: 'Tudo é Rio - Carla Madeira', pages: 121, progress: 45 },
        { id: '2', title: 'Apostila de Desenvolvimento Web - Senac', pages: 85, progress: 70 },
        { id: '3', title: 'Clean Code - Robert C. Martin', pages: 425, progress: 20 },
        { id: '4', title: 'Arquitetura Limpa', pages: 310, progress: 10 },
    ]);

    const navItems = [
        { name: 'Biblioteca', href: '/', icon: BookOpen },
        { name: 'Leitura', href: '/reading', icon: Headphones },
        { name: 'Info', href: '/info', icon: Info },
    ];

    return (
        <main className="flex-1 flex flex-col justify-between p-4 md:p-8 pb-32 md:pb-12 max-w-3xl mx-auto w-full min-h-screen">

            <header className="py-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                <h1 className="font-bold text-lg md:text-xl tracking-tight text-text-main">AudioRead</h1>

                <button className="p-2.5 rounded-xl bg-card-bg border border-border-subtle hover:border-zinc-700 transition-colors text-text-muted flex items-center justify-center cursor-pointer">
                    <Menu className="w-5 h-5 text-text-main" />
                </button>
            </header>

            <div className="space-y-6 my-6 flex-1 overflow-y-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar documentos"
                        className="w-full bg-card-bg border border-border-subtle rounded-2xl pl-11 pr-4 py-3.5 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary-rose transition-all"
                    />
                </div>

                <div className="space-y-3 pb-4">
                    {documents.map((doc) => (
                        <Link
                            key={doc.id}
                            href="/reading"
                            className="flex items-center justify-between p-4 rounded-2xl bg-card-bg border border-border-subtle hover:border-zinc-700 hover:bg-card-hover transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-12 rounded-lg bg-primary-rose/10 border border-primary-rose/20 flex items-center justify-center text-primary-rose font-semibold text-xs">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm md:text-base text-text-main">{doc.title}</h3>
                                    <p className="text-xs text-text-muted mt-0.5">{doc.pages} páginas</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-app-bg px-4 py-3 flex flex-col gap-8 z-50 md:relative md:max-w-none md:bg-transparent md:border-none md:p-0">
                <button className="w-full py-3.5 px-4 rounded-2xl bg-accent-crimson hover:bg-[#b0453c] text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Importar PDF</span>
                </button>

                <nav className="md:hidden flex items-center justify-around pt-1 pb-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive ? 'text-primary-rose' : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

        </main>
    );
}