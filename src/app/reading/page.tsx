// @ts-nocheck
'use client';

import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal, ChevronRight, SkipBack, RotateCcw, Play, Pause, RotateCw, SkipForward, Scale, Volume2 } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';

import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState, useRef } from 'react';
import MenuSettings from '../components/MenuSettings';
import { match } from 'assert';
import { sendTTS } from '../services/tts';

export default function ReadingPage() {
    const menuRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const { selectedDocument } = useDocuments();
    const [selectedVoice, setSelectedVoice] = useState('pt-BR-FranciscaNeural');

    const [currentTime, setCurrentTime] = useState(0);
    const [currentText, setCurrentText] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [volume, setVolume] = useState(1);
    const [textSize, setTextSize] = useState('Small');

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

    // Carrega o volume inicial salvo no localStorage para evitar conflito na montagem
    useEffect(() => {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (typeof parsed.volume === 'number') {
                    setVolume(parsed.volume);
                }
            } catch {
                // ignora erro de parse
            }
        }
    }, []);


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

    function skipAudio(seconds: number) {
        const player = audioRef.current;

        if (!player) return;

        const newTime = Math.max(0, Math.min(
            player.currentTime + seconds, player.duration || 0)
        );

        player.currentTime = newTime;
        setCurrentTime(newTime);
    }

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

            player.volume = volume;
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

    return (
        <main className="flex min-h-screen w-full max-w-2xl flex-1 flex-col justify-between mx-auto px-4 sm:px-6 lg:px-8 text-text-main">

            <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-2xl items-center justify-between border-b border-border-subtle/40 bg-app-bg/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">

                <Link
                    href="/"
                    className="flex cursor-pointer items-center justify-center rounded-xl border border-border-subtle/50 bg-card-bg/40 p-2.5 text-text-muted transition-colors hover:border-border-subtle hover:text-text-main"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>

                <h1 className="line-clamp-1 px-3 text-center text-sm font-semibold text-text-main md:text-base">
                    Reading
                </h1>

                <div ref={menuRef} className="relative">
                    <MenuSettings
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        onVoiceChange={setSelectedVoice}
                        onTextSizeChange={setTextSize}
                        onVolumeChange={(newVol) => {
                            setVolume(newVol);
                            if (audioRef.current) {
                                audioRef.current.volume = newVol;
                            }
                        }}
                    />
                </div>

            </header>

            <div className="flex-1 overflow-y-auto pt-20 pb-48">
                <div
                    className="space-y-0.5 py-6 tracking-wide text-text-main"
                    style={{
                        fontSize: {
                            Small: 'var(--reading-small)',
                            Medium: 'var(--reading-medium)',
                            Large: 'var(--reading-large)',
                            'Extra large': 'var(--reading-extra-large)',
                        }[textSize],
                    }}
                >


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
                                                ? 'text-text-muted'
                                                : sentenceIndex === currentText && isPlaying
                                                    ? 'bg-primary-rose/90 text-white'
                                                    : 'text-text-main'
                                                }`}
                                        >
                                            {sentence}{' '}
                                        </span>
                                    ))}
                                </p>
                            );
                        })

                    ) : (
                        <p className="py-16 text-center text-zinc-500">
                            Nenhum conteúdo disponível.
                        </p>
                    )}
                </div>
            </div >

            <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl space-y-4 border-t border-border-subtle/40 bg-app-bg/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
                <div className="hidden items-center justify-end gap-3 md:flex">
                    <Volume2 className="h-4 w-4 shrink-0 text-text-muted" />

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(evt) => {
                            const newVolume = Number(evt.target.value);
                            setVolume(newVolume);

                            if (audioRef.current) {
                                audioRef.current.volume = newVolume;
                            }

                            // Atualiza também no localStorage para manter sincronizado com o MenuSettings
                            const saved = localStorage.getItem('userSettings');
                            if (saved) {
                                try {
                                    const parsed = JSON.parse(saved);
                                    parsed.volume = newVolume;
                                    localStorage.setItem('userSettings', JSON.stringify(parsed));
                                } catch { }
                            }
                        }}
                        aria-label="Volume do áudio"
                        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-card-hover accent-accent-crimson"
                        style={{
                            accentColor: 'var(--accent-crimson)',
                        }}
                    />
                    <span className="w-8 text-right text-xs tabular-nums text-text-muted">
                        {Math.round(volume * 100)}%
                    </span>
                </div>


                <div className="space-y-2">
                    <div
                        className="h-1 w-full overflow-hidden rounded-full bg-card-hover"
                        role="progressbar"
                        aria-label="Progresso do áudio"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={duration ? Math.round((currentTime / duration) * 100) : 0}
                    >
                        <div
                            className="h-full rounded-full bg-accent-crimson transition-[width] duration-200"
                            style={{
                                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                            }}
                        />
                    </div>

                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border-subtle bg-card-bg px-3">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
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
                            aria-label="Número da página"
                            className="absolute inset-0 min-w-0 text-center text-sm font-medium text-text-main outline-none"
                        />

                        <span className="ml-auto whitespace-nowrap text-xs text-text-muted">
                            / {totalPages}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoToPage}
                        className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border border-border-subtle bg-card-hover px-3 text-xs font-medium text-text-main transition-colors hover:border-primary-rose hover:bg-card-bg sm:text-sm"
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
                        className="cursor-pointer p-2 text-text-muted transition-colors hover:text-text-main disabled:cursor-not-allowed disabled:opacity-30"                   >

                        <SkipBack className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => skipAudio(-15)}
                        aria-label="Voltar 15 segundos"
                        title="Voltar 15 segundos"
                        className="flex cursor-pointer items-center gap-1 p-2 text-text-muted transition-colors hover:text-text-main"
                    >
                        <span className="relative flex items-center justify-center">
                            <RotateCcw className="h-6 w-6" />
                            <span className="absolute text-[8px] font-semibold">15</span>
                        </span>
                    </button>

                    <button
                        onClick={playReading}
                        disabled={isGenerating || paragraphs.length === 0}
                        aria-label={isPlaying ? 'Audio playing' : 'Play reading'}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-accent-crimson p-4 text-white transition-colors hover:bg-accent-crimson/90 disabled:cursor-not-allowed disabled:opacity-50"
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
                        onClick={() => skipAudio(15)}
                        aria-label="Avançar 15 segundos"
                        title="Avançar 15 segundos"
                        className="flex cursor-pointer items-center gap-1 p-2 text-text-muted transition-colors hover:text-text-main"
                    >
                        <span className="relative flex items-center justify-center">
                            <RotateCw className="h-6 w-6" />
                            <span className="absolute text-[8px] font-semibold">15</span>
                        </span>
                    </button>

                    <button
                        onClick={nextPage}
                        disabled={pageCurent === totalPages}
                        aria-label="Next page"
                        className="cursor-pointer p-2 text-text-muted transition-colors hover:text-text-main disabled:cursor-not-allowed disabled:opacity-30"                   >
                        <SkipForward className="h-5 w-5" />
                    </button>
                </div>


            </div>
        </main >
    );
}