'use client';

import { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Settings2, Volume2, BookOpen } from 'lucide-react';

export default function ReadingPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const cycleSpeed = () => {
        if (speed === 1) setSpeed(1.25);
        else if (speed === 1.25) setSpeed(1.5);
        else if (speed === 1.5) setSpeed(2);
        else setSpeed(1);
    };

    return (
        <main className="flex-1 flex flex-col justify-between p-4 md:p-8 max-w-3xl mx-auto w-full min-h-screen text-zinc-100">

            <header className="py-4 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors text-zinc-300 flex items-center justify-center cursor-pointer">
                    <ArrowLeft className="w-5 h-5 text-zinc-200" />
                </button>
                <div className="text-center">
                    <span className="text-xs font-medium text-zinc-400">Leitura atual</span>
                    <h1 className="font-bold text-sm md:text-base text-zinc-100 line-clamp-1">Tudo é Rio - Carla Madeira</h1>
                </div>
                <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors text-zinc-300 flex items-center justify-center cursor-pointer">
                    <Settings2 className="w-5 h-5 text-zinc-200" />
                </button>
            </header>

            <div className="space-y-8 my-6 flex-1 flex flex-col justify-center">

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-32 h-40 rounded-2xl bg-primary-rose/10 border border-primary-rose/20 flex items-center justify-center text-primary-rose">
                        <BookOpen className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-zinc-100">Tudo é Rio</h2>
                        <p className="text-sm text-zinc-400">Carla Madeira</p>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 md:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                        <span>Página 45 de 121</span>
                        <span>45% concluído</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden cursor-pointer">
                        <div className="bg-primary-rose h-full w-[45%]"></div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer">
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-5 rounded-2xl bg-accent-crimson hover:bg-[#b0453c] text-white transition-all cursor-pointer"
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>

                    <button className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer">
                        <RotateCw className="w-5 h-5" />
                    </button>
                </div>

            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
                <button
                    onClick={cycleSpeed}
                    className="px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-zinc-300 hover:text-zinc-100 transition-colors cursor-pointer font-medium"
                >
                    {speed}x
                </button>

                <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-zinc-400" />
                    <span>Voz Padrão (Neural)</span>
                </div>
            </div>

        </main>
    );
}