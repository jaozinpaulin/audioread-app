'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, Pause, RotateCw, SkipForward } from 'lucide-react';

export default function ReadingPage() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <main className="flex-1 flex flex-col justify-between max-w-2xl mx-auto w-full min-h-screen text-zinc-100 px-4">

            <header className="fixed top-0 left-0 right-0 max-w-2xl mx-auto bg-zinc-950/80 backdrop-blur-md px-4 py-3 border-b border-zinc-800/40 flex items-center justify-between shrink-0 z-50">
                <Link
                    href="/"
                    className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors text-zinc-300 flex items-center justify-center cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-200" />
                </Link>

                <h1 className="font-semibold text-sm md:text-base text-zinc-100 line-clamp-1 px-3 text-center">
                    Tudo é Rio - Carla Madeira
                </h1>

                <button className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors flex items-center justify-center cursor-pointer">
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto pt-20 pb-48 space-y-4 text-zinc-300 leading-relaxed text-sm md:text-base tracking-wide font-normal">
                <p>
                    Não se dá tanta alegria impunemente. É um perigo tirar das cinzas quem com muito custo aceita não ter tudo o que quer. Lucy não entendeu o que pôs o reverso em jogo, não quis saber de onde veio toda a intensidade, apenas experimentou ser ela de novo.
                </p>

                <p className="border-l border-primary-rose pl-3 text-zinc-100 font-medium">
                    Retomou a confiança no próprio caminho. Se achou melhor do que imaginava e, no entusiasmo do momento, não calculou os passos do que vivia. Sabia exatamente o que buscava e reconhecia o valor da própria história.
                </p>

                <p>
                    Mas dessa vez tinha sido diferente, dessa vez havia um sentido maior em cada detalhe. A experiência transformou lugares esquecidos, despertando uma percepção inteiramente nova do presente.
                </p>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/40 px-4 py-4 space-y-4 z-50">

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-center min-w-[90px]">
                        <span className="text-[10px] uppercase font-medium text-zinc-500 tracking-wider">Page</span>
                        <span className="text-xs font-semibold text-zinc-200">85/121</span>
                    </div>

                    <button className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 text-zinc-200 font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                        <span>Go to page</span>
                    </button>
                </div>

                <div className="flex items-center justify-between px-6 pt-1">
                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 rounded-full bg-accent-crimson hover:bg-[#b0453c] text-white transition-all cursor-pointer flex items-center justify-center"
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>

                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <RotateCw className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

            </div>

        </main>
    );
}