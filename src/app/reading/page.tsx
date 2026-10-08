// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, RotateCw, SkipForward, } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';

export default function ReadingPage() {
    const { selectedDocument } = useDocuments();

    const [text, setText] = useState('');
    const [pageCurent, setPageCurrent] = useState(
        Number(selectedDocument?.currentPage) || 1
    );
    const [totalPages, setTotalPages] = useState(
        Number(selectedDocument?.pages) || 1
    );

    const nextPage = () => {
        if (pageCurent < totalPages) {
            setPageCurrent(pageCurent + 1);
        }
    };

    const prevPage = () => {
        if (pageCurent > 1) {
            setPageCurrent(pageCurent - 1);
        }
    };

    const readPdf = async () => {
        if (!selectedDocument) return;

        const file = selectedDocument.file;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const page = await pdf.getPage(pageCurent);
        const textContent = await page.getTextContent();

        const items = [];

        textContent.items.forEach((item) => {
            if ('str' in item) {
                items.push({
                    // x: item.transform[4],
                    // y: item.transform[5],
                    text: item.str,
                });
            }
        });

        const pageText = items
            .map((item) => item.text)
            .join(' ');

        setText(pageText);
        setTotalPages(pdf.numPages);
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

                <button className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors flex items-center justify-center cursor-pointer">
                    <SlidersHorizontal className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto pt-20 pb-48">
                <div className="py-6 text-zinc-300 leading- text-sm md:text-base tracking-wide">
                    <p>{text}</p>
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
