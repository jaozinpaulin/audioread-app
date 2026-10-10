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
    const { documents, setDocuments, setSelectedDocument } = useDocuments()

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

        setDocuments((prev) => [...prev, {
            file,
            name: file.name,
            pages: pdf.numPages,
            currentPage: 1,
        }]);
    };

    // const handleOpenPdf = (doc) => {
    //     const pdfUrl = URL.createObjectURL(doc.file);
    //     window.open(pdfUrl, '_blank');
    // };

    const handleOpenPdfPage = (doc) => {
        setSelectedDocument(doc)
        router.push("/reading")
    }

    return (
        <main className="flex-1 flex flex-col justify-between p-4 md:p-8 pb-32 md:pb-12 max-w-3xl mx-auto w-full min-h-screen">
            <header className="fixed top-0 left-0 right-0 max-w-3xl mx-auto bg-app-bg/85 backdrop-blur-md px-4 md:px-8 py-3.5 border-b border-border-subtle flex items-center justify-between shrink-0 z-50">
                <h1 className="text-lg md:text-xl font-semibold tracking-tight text-text-main">
                    Letrê
                </h1>

                <span className="text-xs text-text-muted">v0.3</span>
            </header>


            <div className="space-y-6 pt-16 my-6 flex-1 overflow-y-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar documentos"
                        className="w-full bg-card-bg border border-border-subtle rounded-2xl pl-11 pr-4 py-3.5 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary-rose transition-all"
                    />
                </div>

                <div className="space-y-3 pb-4">
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
                            onClick={() => {
                                handleOpenPdfPage(doc)
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-card-bg border border-border-subtle hover:border-zinc-700 hover:bg-card-hover transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-12 rounded-lg bg-primary-rose/10 border border-primary-rose/20 flex items-center justify-center text-primary-rose">
                                    <BookOpen className="w-5 h-5" />
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm md:text-base text-text-main">
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

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-app-bg/90 backdrop-blur-md px-4 py-3 flex flex-col gap-6 z-50 md:relative md:max-w-none md:bg-transparent md:backdrop-blur-none md:p-0">

                <label className="w-full py-3.5 px-4 rounded-2xl bg-accent-crimson hover:bg-[#b0453c] text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
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