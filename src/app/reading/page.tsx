// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, RotateCw, SkipForward, Scale, } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';

export default function ReadingPage() {
    const { selectedDocument } = useDocuments();

    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [pageCurent, setPageCurrent] = useState(
        Number(selectedDocument?.currentPage) || 1
    );
    const [totalPages, setTotalPages] = useState(
        Number(selectedDocument?.pages) || 1
    );

    const nextPage = () => {
        if (pageCurent < totalPages) setPageCurrent(pageCurent + 1);
    };

    const prevPage = () => {
        if (pageCurent > 1) setPageCurrent(pageCurent - 1);
    };

    const renderPageImage = async (page) => {
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) return null;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvas, canvasContext: context, viewport, }).promise;

        return canvas.toDataURL('image/jpeg', 0.85);
    };


    const readPdf = async () => {
        if (!selectedDocument) return;

        setIsLoading(true);

        setPageImage(null);
        setParagraphs([]);

        try {
            const file = selectedDocument.file;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const page = await pdf.getPage(pageCurent);
            const textContent = await page.getTextContent();

            const linesMap = new Map();

            textContent.items.forEach((item) => {
                if ('str' in item && item.str.trim()) {
                    const y = Math.round(item.transform[5]);
                    if (!linesMap.has(y)) linesMap.set(y, []);
                    linesMap.get(y).push({ x: item.transform[4], text: item.str });
                }
            });

            const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
            const extractedParagraphs: string[] = [];
            let currentParagraph = '';
            let lastY: number | null = null;

            sortedY.forEach((y) => {
                const lineItems = linesMap.get(y).sort((a, b) => a.x - b.x);
                const lineText = lineItems.map((item) => item.text).join(' ').trim();

                if (!lineText) return;

                const isNewParagraph = lastY !== null && lastY - y > 18;

                if (isNewParagraph && currentParagraph) {
                    extractedParagraphs.push(currentParagraph.trim());
                    currentParagraph = lineText;
                } else {
                    currentParagraph = currentParagraph
                        ? `${currentParagraph} ${lineText}`
                        : lineText;
                }

                lastY = y;
            });

            if (currentParagraph) {
                extractedParagraphs.push(currentParagraph.trim());
            }

            if (extractedParagraphs.length === 0) {
                const image = await renderPageImage(page);
                setPageImage(image ?? null);
            }

            setParagraphs(extractedParagraphs);
            setTotalPages(pdf.numPages);

        } catch (error) {

            console.error('Erro ao ler o PDF:', error);
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        readPdf();
    }, [selectedDocument, pageCurent]);

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
                    Reading
                </h1>
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center justify-center rounded-xl border p-2.5 transition-colors ${isOpen
                            ? 'border-zinc-700 bg-zinc-900 text-zinc-100'
                            : 'border-zinc-800/50 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
                            }`}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black/20">

                            <div className="mb-4 border-b border-zinc-800/70 pb-3">
                                <h2 className="text-sm font-semibold text-zinc-100">
                                    Reading settings
                                </h2>

                                <p className="mt-1 text-xs text-zinc-500">
                                    Customize your reading experience.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <button className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-zinc-900">
                                    <div>
                                        <p className="text-sm text-zinc-200">
                                            Accessibility
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Reading preferences
                                        </p>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                                </button>

                                <button className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-zinc-900">
                                    <div>
                                        <p className="text-sm text-zinc-200">
                                            Orientation
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Page layout
                                        </p>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                                </button>

                                <button className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-zinc-900">
                                    <div>
                                        <p className="text-sm text-zinc-200">
                                            Appearance
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Reading colors
                                        </p>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                                </button>

                                <button className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-zinc-900">
                                    <div>
                                        <p className="text-sm text-zinc-200">
                                            Audio
                                        </p>
                                        <p className="mt-1 text-xs text-zinc-500">
                                            Voice and playback
                                        </p>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </header>

            <div className="flex-1 overflow-y-auto pt-20 pb-48">
                <div className="py-6 text-zinc-300 text-sm md:text-base tracking-wide space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />
                        </div>
                    ) : pageImage ? (
                        <img
                            src={pageImage}
                            alt="Não foi possível exibir o texto desta página."
                            className="w-full h-auto rounded-lg"
                        />
                    ) : paragraphs.length > 0 ? (
                        paragraphs.map((p, index) => (
                            <p key={index} className="leading-relaxed">
                                {p}
                            </p>
                        ))
                    ) : (
                        <p className="py-16 text-center text-sm text-zinc-500">
                            Nenhum conteúdo disponível.
                        </p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/40 px-4 py-4 space-y-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-center min-w-[90px]">
                        <span className="text-[10px] uppercase font-medium text-zinc-500 tracking-wider">
                            Page
                        </span>
                        <span className="text-xs font-semibold text-zinc-200">
                            {pageCurent}/{totalPages}
                        </span>
                    </div>

                    <button className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 text-zinc-200 font-medium text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                        <span>Go to page</span>
                    </button>
                </div>

                <div className="flex items-center justify-between px-6 pt-1">
                    <button
                        onClick={prevPage}
                        disabled={pageCurent === 1}
                        className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <button className="p-4 rounded-full bg-accent-crimson hover:bg-[#b0453c] text-white transition-all cursor-pointer flex items-center justify-center">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>

                    <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
                        <RotateCw className="w-5 h-5" />
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={pageCurent === totalPages}
                        className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </main>
    );
}