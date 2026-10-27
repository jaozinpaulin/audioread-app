// @ts-nocheck
'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, BookOpen, Headphones, Info, Upload } from 'lucide-react';
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

    // const [documents, setDocuments] = useState([]);

    const navItems = [
        { name: 'Biblioteca', href: '/', icon: BookOpen },
        { name: 'Leitura', href: '/reading', icon: Headphones },
        { name: 'Info', href: '/info', icon: Info },
    ];

    const handleFileChange = async (evt) => {
        const file = evt.target.files?.[0];
        if (!file) return;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        setDocuments((prev) => [
            ...prev,
            {
                file,
                name: file.name,
                pages: pdf.numPages,
                currentPage: 1,
            },
        ]);
    };

    // const handleOpenPdf = (doc) => {
    //     const pdfUrl = URL.createObjectURL(doc.file);
    //     window.open(pdfUrl, '_blank');
    // };

    const handleOpenPdfPage = (doc) => {
        setSelectedDocument(doc);
        router.push('/reading');
    };

    return (
        <main className="flex min-h-screen w-full flex-1 flex-col justify-between p-4 pb-32 md:p-8 md:pb-12 lg:px-12">
            <header className="fixed top-0 left-0 z-50 w-full border-b border-border-subtle bg-app-bg/85 px-4 py-3.5 backdrop-blur-md sm:px-6 md:px-8 lg:px-12">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                    <h1 className="text-lg font-semibold tracking-tight text-text-main md:text-xl">
                        Letrê
                    </h1>

                    <span className="text-xs text-text-muted">v0.3</span>
                </div>
            </header>

            <div className="my-6 mx-auto w-full max-w-5xl flex-1 space-y-6 overflow-y-auto pt-16">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />

                    <input
                        type="text"
                        placeholder="Buscar documentos"
                        className="w-full bg-card-bg border border-border-subtle rounded-2xl pl-11 pr-4 py-3.5 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary-rose transition-all"
                    />
                </div>

                <div className="w-full space-y-3 pb-4">
                    {documents.length === 0 && (
                        <div className="py-14 flex flex-col items-center justify-center text-center space-y-3 rounded-2xl border border-dashed border-border-subtle bg-card-bg/20 p-6">
                            <div className="w-11 h-11 rounded-xl bg-card-bg border border-border-subtle flex items-center justify-center text-text-muted">
                                <BookOpen className="w-5 h-5" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-text-main">
                                    Nenhum documento encontrado
                                </p>

                                <p className="text-xs text-text-muted">
                                    Importe um PDF para iniciar sua leitura.
                                </p>
                            </div>
                        </div>
                    )}

                    {documents.map((doc) => (
                        <div
                            key={`${doc.name}-${doc.file.lastModified}`}
                            onClick={() => handleOpenPdfPage(doc)}
                            className="flex items-center justify-between p-4 rounded-2xl bg-card-bg border border-border-subtle hover:border-zinc-700 hover:bg-card-hover transition-all cursor-pointer"
                        >
                            <div className="flex min-w-0 items-center gap-3.5">
                                <div className="w-10 h-12 shrink-0 rounded-lg bg-primary-rose/10 border border-primary-rose/20 flex items-center justify-center text-primary-rose">
                                    <BookOpen className="w-5 h-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-sm font-medium text-text-main md:text-base">
                                        {doc.name}
                                    </h3>

                                    <p className="text-xs text-text-muted mt-0.5">
                                        PDF · {doc.pages} páginas
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-md flex-col gap-4 border-t border-border-subtle/40 bg-app-bg/90 px-4 py-3  md:static md:max-w-none md:flex-row md:justify-end md:border-0 md:bg-transparent md:p-0 ">

                <label className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-accent-crimson px-5 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b0453c] active:scale-[0.98] md:w-auto md:min-w-72 md:px-8">
                    <Upload className="h-5 w-5" />

                    <span>Importar PDF</span>

                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>

                <nav className="md:hidden flex items-center justify-around pt-1 pb-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${isActive
                                    ? 'text-primary-rose'
                                    : 'text-text-muted hover:text-text-main'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />

                                <span
                                    className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'
                                        }`}
                                >
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
