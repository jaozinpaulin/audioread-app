// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, Pause, RotateCw, SkipForward, Scale, } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';

import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState, useRef } from 'react';
import MenuSettings from '../components/MenuSettings';
import { match } from 'assert';
import { sendTTS } from '../services/tts';

export default function ReadingPage() {
    const menuRef = useRef(null);
    const { selectedDocument } = useDocuments();
    const [selectedVoice, setSelectedVoice] = useState('pt-BR-FranciscaNeural');

    const [currentTime, setCurrentTime] = useState(0);
    const [currentText, setCurrentText] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [pageCurent, setPageCurrent] = useState(
        Number(selectedDocument?.currentPage) || 1,
    );
    const [totalPages, setTotalPages] = useState(
        Number(selectedDocument?.pages) || 1,
    );

    const [pageInput, setPageInput] = useState((pageCurent));
    const [pageError, setPageError] = useState('');

    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [pageImage, setPageImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    function formatTime(time: number) {
        if (!Number.isFinite(time)) return '0:00';

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }


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

    const readPdf = async (pageNumber = pageCurent) => {
        if (!selectedDocument) return null;

        setIsLoading(true);
        setPageImage(null);
        setParagraphs([]);

        try {
            const file = selectedDocument.file;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const linesMap = new Map();

            textContent.items.forEach((item) => {
                if (!('str' in item) || !item.str.trim()) return;

                const y = Math.round(item.transform[5]);

                if (!linesMap.has(y)) {
                    linesMap.set(y, []);
                }

                linesMap.get(y).push({
                    x: item.transform[4],
                    text: item.str,
                });
            });

            const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
            const lines = [];

            sortedY.forEach((y) => {
                const lineItems = linesMap.get(y).sort((a, b) => a.x - b.x);
                const lineText = lineItems
                    .map((item) => item.text)
                    .join(' ')
                    .trim();

                if (lineText) lines.push(lineText);
            });

            const fullText = lines.join(' ').replace(/\s+/g, ' ').trim();

            setTotalPages(pdf.numPages);

            if (!fullText && pageNumber === pageCurent) {
                const image = await renderPageImage(page);
                setPageImage(image ?? null);
            }

            if (pageNumber === pageCurent) {
                setParagraphs(fullText ? [fullText] : []);
            }

            return fullText;
        } catch (error) {
            console.error('Erro ao ler o PDF:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };



    function getCurrentTextIndex(text: string, progress: number) {
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
        const totalCharacters = sentences.reduce((total, sentence) => total + sentence.length, 0);
        const currentCharacter = Math.floor(totalCharacters * progress);

        let characterCount = 0;

        for (let index = 0; index < sentences.length; index++) {
            characterCount += sentences[index].length;

            if (currentCharacter < characterCount) {
                return index;
            }
        }

        return Math.max(sentences.length - 1, 0);
    }


    async function playReading() {
        if (isGenerating || paragraphs.length === 0) return;

        if (audioRef.current) {
            if (audioRef.current.paused) {
                await audioRef.current.play();
                setIsPlaying(true);
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
            }

            return;
        }

        setIsGenerating(true);

        try {
            const text = paragraphs.join(' ');
            const audio = await sendTTS(text, selectedVoice);
            const audioUrl = URL.createObjectURL(audio);
            const player = new Audio(audioUrl);

            audioRef.current = player;

            player.ontimeupdate = () => {
                setCurrentTime(player.currentTime);

                if (player.duration) {
                    const progress = player.currentTime / player.duration;
                    const text = paragraphs.join(' ');

                    setCurrentText(getCurrentTextIndex(text, progress));
                }
            };

            player.onloadedmetadata = () => {
                setDuration(player.duration);
            };

            player.onended = () => {
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;

                setCurrentTime(0);
                setDuration(0);
                setIsPlaying(false);
            };

            player.onerror = () => {
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;

                setCurrentTime(0);
                setDuration(0);
                setIsPlaying(false);
            };

            await player.play();
            setIsPlaying(true);
        } catch (error) {
            console.error('Erro ao reproduzir a leitura:', error);
        } finally {
            setIsGenerating(false);
        }
    }


    useEffect(() => {
        readPdf();
    }, [selectedDocument, pageCurent]);

    useEffect(() => {
        setPageInput(String(pageCurent));
    }, [pageCurent]);

    useEffect(() => {
        const player = audioRef.current;

        if (player) {
            player.pause();
            player.currentTime = 0;
            audioRef.current = null;
            setIsPlaying(false);
        }
    }, [pageCurent]);


    console.log(currentText)

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
                    <MenuSettings isOpen={isOpen} setIsOpen={setIsOpen} onVoiceChange={setSelectedVoice} />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pt-20 pb-48">
                <div className="py-6 text-zinc-300 text-sm md:text-base tracking-wide space-y-0.5">
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

                        paragraphs.map((p, index) => {
                            const sentences = p.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

                            return (
                                <p key={index} className="leading-relaxed">
                                    {sentences.map((sentence, sentenceIndex) => (
                                        <span
                                            key={sentenceIndex}
                                            className={`rounded transition-colors ${sentenceIndex < currentText
                                                ? 'text-zinc-500'
                                                : sentenceIndex === currentText && isPlaying
                                                    ? 'bg-accent-crimson/65 text-zinc-100'
                                                    : 'text-zinc-300'
                                                }`}
                                        >
                                            {sentence}{' '}
                                        </span>
                                    ))}
                                </p>
                            );
                        })

                    ) : (
                        <p className="py-16 text-center text-sm text-zinc-500">
                            Nenhum conteúdo disponível.
                        </p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800/40 px-4 py-4 space-y-4 z-50">

                <div className="space-y-2">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={Math.min(currentTime, duration || 0)}
                        onChange={(event) => {
                            const time = Number(event.target.value);

                            if (audioRef.current) {
                                audioRef.current.currentTime = time;
                                setCurrentTime(time);
                            }
                        }}
                        disabled={!duration}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-[#c94f45] disabled:cursor-not-allowed"
                        aria-label="Progresso do áudio"
                    />

                    <div className="flex justify-between text-xs text-zinc-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex min-w-[120px] items-center gap-2 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 px-3 py-3">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                            Page
                        </span>

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
                            className="w-10 bg-transparent text-sm font-semibold text-zinc-200 outline-none"
                        />

                        <span className="text-xs text-zinc-500">
                            / {totalPages}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoToPage}
                        className="flex flex-1 cursor-pointer items-center justify-center rounded-2xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3 text-xs font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600 md:text-sm"
                    >
                        Go to page
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
                        aria-label="Previous page"
                        className="cursor-pointer p-2 text-zinc-400 transition-colors hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <SkipBack className="h-5 w-5" />
                    </button>

                    <button
                        disabled
                        aria-label="Rewind audio"
                        className="cursor-not-allowed p-2 text-zinc-600"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </button>

                    <button
                        onClick={playReading}
                        disabled={isGenerating || paragraphs.length === 0}
                        aria-label={isPlaying ? 'Audio playing' : 'Play reading'}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-accent-crimson p-4 text-white transition-colors hover:bg-[#b0453c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : isPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                        ) : (
                            <Play className="ml-0.5 h-6 w-6 fill-current" />
                        )}
                    </button>

                    <button
                        disabled
                        aria-label="Forward audio"
                        className="cursor-not-allowed p-2 text-zinc-600"
                    >
                        <RotateCw className="h-5 w-5" />
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={pageCurent === totalPages}
                        aria-label="Next page"
                        className="cursor-pointer p-2 text-zinc-400 transition-colors hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <SkipForward className="h-5 w-5" />
                    </button>
                </div>


            </div>
        </main>
    );
}
