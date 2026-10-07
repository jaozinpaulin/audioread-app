'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function InfoPage() {
    return (
        <main className="flex-1 flex flex-col max-w-xl mx-auto w-full min-h-screen bg-app-bg text-text-main px-5">

            <header className="fixed top-0 left-0 right-0 max-w-xl mx-auto bg-app-bg/85 backdrop-blur-md px-5 py-3.5 border-b border-border-subtle flex items-center justify-between shrink-0 z-50">
                <Link
                    href="/"
                    className="p-2 -ml-2 rounded-xl text-text-muted hover:text-text-main hover:bg-card-bg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <h1 className="font-medium text-sm text-text-muted">Sobre</h1>

                <div className="w-8"></div>
            </header>

            <div className="pt-24 pb-12 space-y-8 flex-1">

                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold tracking-tight text-text-main">AudioRead</h2>
                        <span className="text-[10px] font-mono text-primary-rose bg-primary-rose/10 border border-primary-rose/20 px-2 py-0.5 rounded-full">
                            v1.0.0
                        </span>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed max-w-sm">
                        Leitor minimalista com síntese de voz e experiência de leitura contínua, sem distrações.
                    </p>
                </div>

                <div className="space-y-2">
                    <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                        Projeto
                    </span>
                    <div className="divide-y divide-border-subtle border-t border-b border-border-subtle text-sm">
                        <div className="py-3.5 flex items-center justify-between">
                            <span className="text-text-muted">Desenvolvedor</span>
                            <span className="text-text-main font-medium">João Paulo</span>
                        </div>
                        <div className="py-3.5 flex items-center justify-between">
                            <span className="text-text-muted">Tecnologias</span>
                            <span className="text-primary-rose font-mono text-xs">Next.js • Tailwind CSS</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                        Links
                    </span>
                    <div className="divide-y divide-border-subtle border-t border-b border-border-subtle text-sm">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="py-3.5 flex items-center justify-between text-text-muted hover:text-text-main transition-colors group cursor-pointer"
                        >
                            <span>Código Fonte</span>
                            <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary-rose transition-colors" />
                        </a>
                        <a
                            href="https://okiiji.me"
                            target="_blank"
                            rel="noreferrer"
                            className="py-3.5 flex items-center justify-between text-text-muted hover:text-text-main transition-colors group cursor-pointer"
                        >
                            <span>Portfólio</span>
                            <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary-rose transition-colors" />
                        </a>
                    </div>
                </div>

            </div>

        </main>
    );
}