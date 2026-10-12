// @ts-nocheck
'use client';

import { SlidersHorizontal, ChevronDown } from "lucide-react"
import { useState } from "react";

const textSizes = [
    { name: "sm" },
    { name: "md" },
    { name: "lg" },
    { name: "xl" }
]

const systemTheme = ["system", "light", "dark"];
const languages = ["português", "inglês", "espanhol"];
const voices = ["voice 1", "voice 2", "voice 3", "voice 4", "voice 5", "voice 6"];

export default function MenuSettings({ isOpen, setIsOpen }) {
    const [sizeActive, setSizeActive] = useState("sm");
    const [systemThemeActive, setSystemThemeActive] = useState("system");

    const [languageActive, setLanguageActive] = useState("inglês");
    const [languageOpen, setLanguageOpen] = useState(false);

    const [voiceActive, setVoiceActive] = useState("voice 1");
    const [voiceOpen, setVoiceOpen] = useState(false);

    const [readingSpeed, setReadingSpeed] = useState(1);
    const [pitch, setPitch] = useState(1);

    const handleReset = () => {
        setSizeActive("sm");
        setSystemThemeActive("system");
        setLanguageActive("inglês");
        setVoiceActive("voice 1");
        setReadingSpeed(1);
        setPitch(1);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Menu configurações de acessibilidade"
                className={`flex items-center justify-center rounded-xl cursor-pointer border p-2.5 transition-all duration-200 ${isOpen
                        ? 'border-zinc-700 bg-zinc-900 text-zinc-100'
                        : 'border-[var(--color-border-subtle)] bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:border-zinc-700 hover:text-[var(--color-text-main)]'
                    }`}
            >
                <SlidersHorizontal className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-card-bg)] p-4 shadow-2xl shadow-black/50 backdrop-blur-md">

                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Settings
                        </h2>
                    </div>

                    {/* Controles */}
                    <div className="space-y-4 flex flex-col text-xs">

                        {/* Reading Speed */}
                        <div className="space-y-1.5 flex flex-col relative z-0">
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <label className="font-medium">Reading Speed</label>
                                <span className="text-[var(--color-text-main)]">{readingSpeed}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={readingSpeed}
                                onChange={(e) => setReadingSpeed(e.target.value)}
                                className="w-full accent-zinc-400 cursor-pointer bg-zinc-800 h-1.5 rounded-lg appearance-none focus:outline-none"
                            />
                        </div>

                        {/* Pitch */}
                        <div className="space-y-1.5 flex flex-col relative z-0">
                            <div className="flex justify-between text-[var(--color-text-muted)]">
                                <label className="font-medium">Pitch</label>
                                <span className="text-[var(--color-text-main)]">{pitch}</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(e.target.value)}
                                className="w-full accent-zinc-400 cursor-pointer bg-zinc-800 h-1.5 rounded-lg appearance-none focus:outline-none"
                            />
                        </div>

                        {/* Text Size */}
                        <div className="space-y-1.5 flex flex-col">
                            <label className="font-medium text-[var(--color-text-muted)]">Text Size</label>
                            <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-[var(--color-border-subtle)]">
                                {textSizes.map((typeSize, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSizeActive(typeSize.name)}
                                        className={`flex-1 py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer font-medium uppercase text-[11px] ${sizeActive === typeSize.name
                                                ? "bg-zinc-800 text-[var(--color-text-main)] border border-zinc-700 shadow-xs"
                                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        {typeSize.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* System Theme */}
                        <div className="space-y-1.5 flex flex-col">
                            <label className="font-medium text-[var(--color-text-muted)]">Theme</label>
                            <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-[var(--color-border-subtle)]">
                                {systemTheme.map((theme, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSystemThemeActive(theme)}
                                        className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium capitalize ${theme === systemThemeActive
                                                ? "bg-zinc-800 text-[var(--color-text-main)] border border-zinc-700 shadow-xs"
                                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Dropdown - Abre para cima para não sobrepor o campo Voice */}
                        <div className="space-y-1.5 flex flex-col relative z-30">
                            <label className="font-medium text-[var(--color-text-muted)]">Language</label>
                            <button
                                onClick={() => { setLanguageOpen(!languageOpen); setVoiceOpen(false); }}
                                className="flex items-center justify-between w-full bg-zinc-900 border border-[var(--color-border-subtle)] p-2 rounded-xl text-[var(--color-text-main)] hover:border-zinc-700 transition-colors cursor-pointer capitalize"
                            >
                                <span>{languageActive}</span>
                                <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {languageOpen && (
                                <div className="absolute bottom-full left-0 right-0 z-40 mb-1 max-h-36 overflow-y-auto bg-zinc-900 border border-[var(--color-border-subtle)] rounded-xl shadow-xl flex flex-col p-1">
                                    {languages.map((lang, index) => (
                                        <button
                                            key={index}
                                            onClick={() => { setLanguageActive(lang); setLanguageOpen(false); }}
                                            className={`p-2 rounded-lg text-left transition-colors cursor-pointer capitalize ${languageActive === lang
                                                    ? "bg-zinc-800 text-[var(--color-text-main)] font-medium"
                                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-zinc-800/50"
                                                }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Voice Dropdown - Abre para cima para não cortar no rodapé */}
                        <div className="space-y-1.5 flex flex-col relative z-20">
                            <label className="font-medium text-[var(--color-text-muted)]">Voice</label>
                            <button
                                onClick={() => { setVoiceOpen(!voiceOpen); setLanguageOpen(false); }}
                                className="flex items-center justify-between w-full bg-zinc-900 border border-[var(--color-border-subtle)] p-2 rounded-xl text-[var(--color-text-main)] hover:border-zinc-700 transition-colors cursor-pointer capitalize"
                            >
                                <span>{voiceActive}</span>
                                <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${voiceOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {voiceOpen && (
                                <div className="absolute bottom-full left-0 right-0 z-30 mb-1 max-h-36 overflow-y-auto bg-zinc-900 border border-[var(--color-border-subtle)] rounded-xl shadow-xl flex flex-col p-1">
                                    {voices.map((voice, index) => (
                                        <button
                                            key={index}
                                            onClick={() => { setVoiceActive(voice); setVoiceOpen(false); }}
                                            className={`p-2 rounded-lg text-left transition-colors cursor-pointer capitalize ${voiceActive === voice
                                                    ? "bg-zinc-800 text-[var(--color-text-main)] font-medium"
                                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-zinc-800/50"
                                                }`}
                                        >
                                            {voice}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-3 text-xs">
                        <button
                            onClick={handleReset}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer font-medium"
                        >
                            Default
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-zinc-800 hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 rounded-lg bg-[var(--color-primary-rose)] text-[var(--color-app-bg)] hover:opacity-90 transition-opacity cursor-pointer font-medium shadow-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}