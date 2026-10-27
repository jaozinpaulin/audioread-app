'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function InfoPage() {
    return (
        <main className="flex min-h-screen w-full flex-1 flex-col px-4 text-text-main sm:px-6 md:px-8 lg:px-12">
            <header className="fixed top-0 left-0 z-50 w-full border-b border-border-subtle bg-app-bg/85 px-4 py-3.5 backdrop-blur-md sm:px-6 md:px-8 lg:px-12">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                    <Link
                        href="/"
                        className="-ml-2 rounded-xl p-2 text-text-muted transition-colors hover:bg-card-bg hover:text-text-main"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    <h1 className="text-sm font-medium text-text-muted">
                        Sobre
                    </h1>

                    <div className="w-8" />
                </div>
            </header>

            <div className="mx-auto w-full max-w-5xl flex-1 space-y-10 pb-12 pt-24">
                <section className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Letrê
                        </h2>

                        <span className="rounded-full bg-primary-rose/10 px-2.5 py-1 font-mono text-[10px] text-primary-rose">
                            v0.3
                        </span>
                    </div>

                    <p className="max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
                        Um leitor de documentos digitais com foco em simplicidade e conforto na leitura.
                    </p>
                </section>

                <section className="space-y-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        Projeto
                    </span>

                    <div className="divide-y divide-border-subtle border-y border-border-subtle text-sm">
                        <div className="flex items-center justify-between gap-4 py-4">
                            <span className="text-text-muted">
                                Desenvolvedor
                            </span>

                            <span className="text-right font-medium">
                                João Paulo
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 py-4">
                            <span className="shrink-0 text-text-muted">
                                Tecnologias
                            </span>

                            <span className="text-right font-mono text-xs text-primary-rose sm:text-sm">
                                Next.js · Tailwind CSS
                            </span>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        Links
                    </span>

                    <div className="divide-y divide-border-subtle border-y border-border-subtle text-sm">
                        <a
                            href="https://github.com/jaozinpaulin/Leaf-Me-2.0"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between gap-4 py-4 text-text-muted transition-colors hover:text-text-main"
                        >
                            <span>Código-fonte</span>

                            <ExternalLink className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary-rose" />
                        </a>

                        <a
                            href="https://okiiji.me"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between gap-4 py-4 text-text-muted transition-colors hover:text-text-main"
                        >
                            <span>Portfólio</span>

                            <ExternalLink className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary-rose" />
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}
