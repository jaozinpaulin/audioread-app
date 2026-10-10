// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, RotateCw, SkipForward, Scale, } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState, useRef } from 'react';
import MenuSettings from '../components/MenuSettings';
import { match } from 'assert';

export default function ReadingPage() {
    const menuRef = useRef(null);
    const { selectedDocument } = useDocuments();

    const [pageCurent, setPageCurrent] = useState(
        Number(selectedDocument?.currentPage) || 1,
    );
    const [totalPages, setTotalPages] = useState(
        Number(selectedDocument?.pages) || 1,
    );

    const [pageInput, setPageInput] = useState(String(pageCurent));
    const [pageError, setPageError] = useState('');

    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);



    useEffect(() => {
        const closeMenuSettings = (evt: MouseEvent) => {
            if (
                menuRef &&
                evt.target instanceof Node &&
                !menuRef.current.contains(evt.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', closeMenuSettings);

        return () => {
            document.removeEventListener('mousedown', closeMenuSettings);
        };
    }, []);

    const handleGoToPage = () => {
        const page = Number(pageInput);

        if (!pageInput.trim() || !Number.isInteger(page)) {
            setPageError('Enter a valid page number.'); return;
        } if (page < 1 || page > totalPages) {
            setPageError(`Choose a page between 1 and ${totalPages}.`); return;

        } setPageError(''); setPageCurrent(page);
    };

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

        await page.render({ canvas, canvasContext: context, viewport }).promise;

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
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
                .promise;

            const page = await pdf.getPage(pageCurent);
            const textContent = await page.getTextContent();

            const linesMap = new Map();

            textContent.items.forEach((item) => {
                if ('str' in item && item.str.trim()) {
                    const y = Math.round(item.transform[5]);
                    if (!linesMap.has(y)) linesMap.set(y, []);
                    linesMap
                        .get(y)
                        .push({ x: item.transform[4], text: item.str });
                }
            });

            const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
            const extractedParagraphs: string[] = [];
            let currentParagraph = '';
            let lastY: number | null = null;

            sortedY.forEach((y) => {
                const lineItems = linesMap.get(y).sort((a, b) => a.x - b.x);
                const lineText = lineItems
                    .map((item) => item.text)
                    .join(' ')
                    .trim();

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

                <div ref={menuRef} className="relative">
                    <MenuSettings isOpen={isOpen} setIsOpen={setIsOpen} />
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
                    <div className="relative flex min-w-[90px] flex-col justify-center rounded-2xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                                Page
                            </span>

                            <span className="text-xs font-semibold text-zinc-400">
                                / {totalPages}
                            </span>
                        </div>

                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={totalPages}
                            value={pageInput}
                            onChange={(evt) => {
                                setPageInput(evt.target.value);
                                setPageError('');
                            }}
                            onKeyDown={(evt) => {
                                if (evt.key === 'Enter') {
                                    handleGoToPage();
                                }
                            }}
                            className="w-full bg-transparent text-sm font-semibold text-zinc-200 outline-none"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoToPage}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3 text-xs font-medium text-zinc-200 transition-all hover:border-zinc-700 md:text-sm"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span>Go to page</span>
                    </button>
                </div>

                {pageError && (
                    <p role="alert" className="mt-2 text-xs text-red-400">
                        {pageError}
                    </p>
                )}


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
