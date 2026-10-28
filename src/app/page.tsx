// @ts-nocheck
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search,
    BookOpen,
    Headphones,
    Info,
    Upload,
    FileText,
    ArrowUpRight,
    LoaderCircle,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useDocuments } from './hooks/useDocuments';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export default function Home() {
    const { documents, setDocuments, setSelectedDocument } = useDocuments();

    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState('');

    const navItems = [
        { name: 'Biblioteca', href: '/', icon: BookOpen },
        { name: 'Leitura', href: '/reading', icon: Headphones },
        { name: 'Sobre', href: '/info', icon: Info },
    ];

    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) =>
            doc.name.toLowerCase().includes(search.trim().toLowerCase())
        );
    }, [documents, search]);

    async function handleFileChange(evt) {
        const input = evt.target;
        const file = input.files?.[0];

        if (!file) return;

        setError('');
        setIsImporting(true);

        try {
            if (
                file.type !== 'application/pdf' &&
                !file.name.toLowerCase().endsWith('.pdf')
            ) {
                throw new Error('Selecione um arquivo PDF válido.');
            }

            const alreadyExists = documents.some(
                (doc) =>
                    doc.name === file.name &&
                    doc.file.size === file.size &&
                    doc.file.lastModified === file.lastModified
            );

            if (alreadyExists) {
                setError('Este documento já está na sua biblioteca.');
                return;
            }

            const pdf = await pdfjsLib.getDocument({
                data: await file.arrayBuffer(),
            }).promise;

            setDocuments((prev) => [
                ...prev,
                {
                    file,
                    name: file.name,
                    pages: pdf.numPages,
                    currentPage: 1,
                },
            ]);
        } catch (error) {
            console.error('Erro ao importar PDF:', error);
            setError(
                'Não foi possível importar o PDF. Verifique o arquivo e tente novamente.'
            );
        } finally {
            setIsImporting(false);
            input.value = '';
        }
    }

    function handleOpenDocument(doc) {
        setSelectedDocument(doc);
        router.push('/reading');
    }

    return (
        <main className="flex min-h-screen w-full flex-1 flex-col px-4 pb-32 pt-24 text-text-main sm:px-6 md:px-8 md:pb-12 lg:px-12">
            <header className="fixed left-0 top-0 z-50 w-full border-b border-border-subtle bg-app-bg/90 px-4 backdrop-blur-xl sm:px-6 md:px-8 lg:px-12">
                <div className="mx-auto flex h-[68px] w-full max-w-5xl items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <div>
                            <h1 className="text-base font-semibold tracking-tight">
                                Letrê
                            </h1>
                        </div>
                    </Link>

                    <span className="font-mono text-[10px] text-text-muted">
                        v0.6
                    </span>
                </div>
            </header>

            <div className="mx-auto w-full max-w-5xl flex-1 space-y-8 pt-2">
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Biblioteca
                    </h2>

                    <p className="max-w-lg text-sm leading-6 text-text-muted">
                        Seus documentos, organizados em um só lugar.
                        Escolha o próximo capítulo.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(evt) => setSearch(evt.target.value)}
                            placeholder="Buscar documentos..."
                            aria-label="Buscar documentos"
                            className="h-11 w-full rounded-xl border border-border-subtle bg-card-bg pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-primary-rose"
                        />
                    </div>

                    <span className="text-xs text-text-muted">
                        {documents.length}{' '}
                        {documents.length === 1 ? 'documento' : 'documentos'}
                    </span>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-primary-rose/30 bg-primary-rose/5 px-4 py-3 text-sm text-text-main"
                    >
                        {error}
                    </p>
                )}

                <div className="space-y-3">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <button
                                key={`${doc.name}-${doc.file.lastModified}`}
                                type="button"
                                onClick={() => handleOpenDocument(doc)}
                                className="group flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-card-bg p-4 text-left transition-colors hover:border-primary-rose/40 hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose sm:p-5"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary-rose/20 bg-primary-rose/10 text-primary-rose">
                                    <FileText size={21} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-sm font-medium sm:text-base">
                                        {doc.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-text-muted">
                                        PDF
                                        <span className="mx-2">·</span>
                                        {doc.pages}{' '}
                                        {doc.pages === 1
                                            ? 'página'
                                            : 'páginas'}
                                    </p>

                                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-border-subtle">
                                        <div
                                            className="h-full rounded-full bg-accent-crimson/70"
                                            style={{
                                                width: `${Math.min(
                                                    ((doc.currentPage || 1) /
                                                        Math.max(doc.pages, 1)) *
                                                    100,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="shrink-0 text-text-muted transition-colors group-hover:text-primary-rose"
                                />
                            </button>
                        ))
                    ) : (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle px-6 py-12 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-card-bg text-text-muted">
                                <BookOpen size={22} />
                            </div>

                            <h3 className="text-sm font-medium">
                                {search
                                    ? 'Nenhum resultado encontrado'
                                    : 'Sua biblioteca está vazia'}
                            </h3>

                            <p className="mt-2 max-w-xs text-xs leading-5 text-text-muted">
                                {search
                                    ? 'Tente buscar pelo nome de outro documento.'
                                    : 'Importe seu primeiro PDF e comece sua experiência de leitura.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-app-bg/95 px-4 py-3 backdrop-blur-xl md:static md:mx-auto md:mt-8 md:flex md:w-full md:max-w-5xl md:items-center md:justify-between md:border-0 md:bg-transparent md:p-0">
                <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-accent-crimson px-5 text-sm font-medium text-white transition-colors hover:opacity-90 has-[:disabled]:cursor-wait has-[:disabled]:opacity-70 md:order-2 md:w-auto md:min-w-48">
                    {isImporting ? (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <Upload size={18} />
                    )}

                    <span>
                        {isImporting ? 'Importando PDF...' : 'Importar PDF'}
                    </span>

                    <input
                        type="file"
                        accept="application/pdf"
                        disabled={isImporting}
                        className="sr-only"
                        onChange={handleFileChange}
                    />
                </label>

                <nav
                    aria-label="Navegação principal"
                    className="mt-4 flex items-center justify-around md:order-1 md:mt-0 md:justify-start md:gap-4"
                >
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${isActive
                                    ? 'font-medium text-primary-rose'
                                    : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                <Icon size={16} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </main>
    );
}
