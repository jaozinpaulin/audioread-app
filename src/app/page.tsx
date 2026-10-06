'use client';

import { useState } from 'react';
import { Search, Menu, BookOpen, Headphones, Settings, Upload } from 'lucide-react';

export default function Home() {
    const [documents] = useState([
        { id: '1', title: 'Tudo é Rio - Carla Madeira', pages: 121, progress: 45 },
        { id: '2', title: 'Apostila de Desenvolvimento Web - Senac', pages: 85, progress: 70 },
        { id: '3', title: 'Clean Code - Robert C. Martin', pages: 425, progress: 20 },
        { id: '4', title: 'Arquitetura Limpa', pages: 310, progress: 10 },
    ]);

    return (
        <main className="flex-1 flex flex-col justify-between p-4 md:p-8 pb-32 md:pb-12 max-w-3xl mx-auto w-full min-h-screen">

            <header className="py-4 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                <h1 className="font-bold text-lg md:text-xl tracking-tight text-zinc-100">AudioRead</h1>

                <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors text-zinc-300 flex items-center justify-center cursor-pointer">
                    <Menu className="w-5 h-5 text-zinc-200" />
                </button>
            </header>

            <div className="space-y-6 my-6 flex-1 overflow-y-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search documents"
                        className="w-full bg-zinc-900/90 border border-zinc-700/70 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary-rose transition-all"
                    />
                </div>

                <div className="space-y-3 pb-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-12 rounded-lg bg-primary-rose/10 border border-primary-rose/20 flex items-center justify-center text-primary-rose font-semibold text-xs">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm md:text-base text-zinc-100">{doc.title}</h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">{doc.pages} pages</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-app-bg/95 backdrop-blur-md border-t border-zinc-800/80 px-4 py-3 flex flex-col gap-9 z-50 md:relative md:max-w-none md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none">

                <button className="w-full py-3.5 px-4 rounded-2xl bg-accent-crimson hover:bg-[#b0453c] text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Importar PDF</span>
                </button>

                <nav className="md:hidden flex items-center justify-around pt-1 pb-1">
                    <div className="flex flex-col items-center gap-1 cursor-pointer">
                        <BookOpen className="w-4 h-4 text-primary-rose" />
                        <span className="text-[10px] font-semibold text-primary-rose">Library</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
                        <Headphones className="w-4 h-4" />
                        <span className="text-[10px] font-medium">Player</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span className="text-[10px] font-medium">Settings</span>
                    </div>
                </nav>
            </div>

        </main>
    );
}