// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Check, ChevronDown, RotateCcw, SlidersHorizontal,
    Volume2, Gauge, Monitor, Sun, Moon, Type,
} from 'lucide-react';
import { voices } from '../services/tts';

const textSizes = [
    { name: 'Small', label: 'Pequeno', size: 'text-xs', preview: 'text-sm' },
    { name: 'Medium', label: 'Médio', size: 'text-base', preview: 'text-base' },
    { name: 'Large', label: 'Grande', size: 'text-lg', preview: 'text-lg' },
    { name: 'Extra large', label: 'Extra grande', size: 'text-2xl', preview: 'text-xl' },
];

const themes = [
    { name: 'System', label: 'Sistema', icon: Monitor },
    { name: 'Light', label: 'Claro', icon: Sun },
    { name: 'Dark', label: 'Escuro', icon: Moon },
];

const languages = [
    { name: 'Português', code: 'Portuguese' },
    { name: 'English', code: 'English' },
    { name: 'Español', code: 'Spanish' },
];

const initialSettings = {
    speed: 1,
    textSize: 'Medium',
    theme: 'System',
    language: 'English',
    voice: 'en-US-JennyNeural',
    volume: 1,
};

export default function MenuSettings({
    isOpen, setIsOpen, onVoiceChange, onTextSizeChange, onVolumeChange,
}) {
    const [settings, setSettings] = useState(initialSettings);
    const [savedSettings, setSavedSettings] = useState(initialSettings);
    const [carregado, setCarregado] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const savedSettingsRef = useRef(initialSettings);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('userSettings');

            if (saved) {
                const restored = { ...initialSettings, ...JSON.parse(saved) };
                setSettings(restored);
                setSavedSettings(restored);
                savedSettingsRef.current = restored;
                document.documentElement.dataset.theme = restored.theme.toLowerCase();
                onVoiceChange?.(restored.voice);
                onTextSizeChange?.(restored.textSize);
                onVolumeChange?.(restored.volume);
            } else {
                document.documentElement.dataset.theme = initialSettings.theme.toLowerCase();
            }
        } catch {
            localStorage.removeItem('userSettings');
        } finally {
            setCarregado(true);
        }
    }, []);

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);
    const languageCode = languages.find((item) => item.name === settings.language)?.code;
    const filteredVoices = voices[languageCode] || [];
    const selectedSize = textSizes.find((item) => item.name === settings.textSize) || textSizes[1];

    function applySettings(next) {
        document.documentElement.dataset.theme = next.theme.toLowerCase();
        onVoiceChange?.(next.voice);
        onTextSizeChange?.(next.textSize);
        onVolumeChange?.(next.volume);
    }

    useEffect(() => {
        if (carregado && isOpen) applySettings(settings);
    }, [settings, carregado, isOpen]);

    function update(key, value) {
        setSettings((current) => ({ ...current, [key]: value }));
    }

    function closeDropdowns() {
        setLanguageOpen(false);
        setVoiceOpen(false);
    }

    function cancel() {
        const saved = savedSettingsRef.current;
        setSettings({ ...saved });
        applySettings(saved);
        closeDropdowns();
        setIsOpen(false);
    }

    function save() {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        const next = { ...settings };
        setSavedSettings(next);
        savedSettingsRef.current = next;
        closeDropdowns();
        setIsOpen(false);
    }

    function reset() {
        setSettings({ ...initialSettings });
        closeDropdowns();
    }

    useEffect(() => {
        if (!isOpen || !carregado) return;

        function handleOutsideClick(event) {
            if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
            cancel();
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                cancel();
                buttonRef.current?.focus();
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, carregado, savedSettings]);

    const label = 'mb-2 block text-xs font-medium text-text-muted';
    const control = 'flex w-full items-center justify-between gap-3 rounded-lg border border-border-subtle bg-card-bg px-3 py-2.5 text-sm text-text-main outline-none transition-colors hover:border-primary-rose/50 focus-visible:border-primary-rose focus-visible:ring-2 focus-visible:ring-primary-rose/20';
    const option = 'rounded-lg py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose/40';

    if (!carregado) {
        return (
            <button
                ref={buttonRef}
                type="button"
                aria-label="Reading settings"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg border border-border-subtle bg-card-bg p-2.5 text-text-muted transition-colors hover:text-text-main"
            >
                <SlidersHorizontal size={19} />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => isOpen ? cancel() : setIsOpen(true)}
                aria-label="Reading settings"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className={`rounded-lg border p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose ${isOpen
                    ? 'border-primary-rose/50 bg-card-hover text-text-main'
                    : 'border-border-subtle bg-card-bg text-text-muted hover:text-text-main'
                    }`}
            >
                <SlidersHorizontal size={19} />
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="dialog"
                    aria-label="Reading settings"
                    className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(80vh,680px)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border-subtle bg-app-bg shadow-2xl sm:w-96"
                >
                    <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-4 py-3.5">
                        <div>
                            <h2 className="text-sm font-semibold text-text-main">Reading settings</h2>
                            <p className="mt-1 text-xs leading-5 text-text-muted">Customize your reading experience.</p>
                        </div>
                        {hasChanges && (
                            <span className="shrink-0 rounded-full bg-primary-rose/10 px-2 py-1 text-[10px] font-medium text-primary-rose">
                                Unsaved
                            </span>
                        )}
                    </div>

                    <div className="space-y-5 overflow-y-auto overscroll-contain p-4">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <Gauge size={15} className="text-text-muted" />
                                <h3 className="text-xs font-medium text-text-main">Reading</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label htmlFor="reading-speed" className="text-xs text-text-muted">Reading speed</label>
                                        <span className="text-xs font-medium text-text-main">{settings.speed.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        id="reading-speed"
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={settings.speed}
                                        onChange={(event) => update('speed', Number(event.target.value))}
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose"
                                    />
                                    <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                                        <span>0.5x</span>
                                        <span>2.0x</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label htmlFor="reading-volume" className="flex items-center gap-1.5 text-xs text-text-muted">
                                            <Volume2 size={14} /> Volume
                                        </label>
                                        <span className="text-xs font-medium text-text-main">{Math.round(settings.volume * 100)}%</span>
                                    </div>
                                    <input
                                        id="reading-volume"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={settings.volume}
                                        onChange={(event) => update('volume', Number(event.target.value))}
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose"
                                    />
                                    <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                                        <span>0%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Type size={15} className="text-text-muted" />
                                <h3 className="text-xs font-medium text-text-main">Text size</h3>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {textSizes.map((size) => (
                                    <button
                                        key={size.name}
                                        type="button"
                                        onClick={() => update('textSize', size.name)}
                                        aria-label={size.label}
                                        aria-pressed={settings.textSize === size.name}
                                        className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose ${settings.textSize === size.name
                                            ? 'border-primary-rose bg-card-hover text-text-main'
                                            : 'border-border-subtle bg-card-bg text-text-muted hover:bg-card-hover hover:text-text-main'
                                            }`}
                                    >
                                        <span className={`${size.size} leading-none`} aria-hidden="true">A</span>
                                        <span className="text-[10px]">{size.label}</span>
                                        {settings.textSize === size.name && <Check size={12} />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-3 rounded-lg border border-border-subtle bg-card-bg p-3">
                                <span className="mb-2 block text-[10px] font-medium text-text-muted">Reading preview</span>
                                <p className={`${selectedSize.preview} leading-relaxed text-text-main`}>
                                    The right text size makes reading more comfortable.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <h3 className={label}>Appearance</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {themes.map(({ name, label: themeLabel, icon: Icon }) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => update('theme', name)}
                                        aria-pressed={settings.theme === name}
                                        className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose ${settings.theme === name
                                            ? 'border-primary-rose bg-card-hover text-text-main'
                                            : 'border-border-subtle bg-card-bg text-text-muted hover:bg-card-hover hover:text-text-main'
                                            }`}
                                    >
                                        <Icon size={17} />
                                        <span>{themeLabel}</span>
                                        {settings.theme === name && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <h3 className={`${label} mb-3`}>Language and voice</h3>

                            <div>
                                <label className={label}>Language</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        aria-expanded={languageOpen}
                                        onClick={() => {
                                            setLanguageOpen(!languageOpen);
                                            setVoiceOpen(false);
                                        }}
                                        className={control}
                                    >
                                        <span>{settings.language}</span>
                                        <ChevronDown size={15} className={`shrink-0 transition-transform motion-reduce:transition-none ${languageOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {languageOpen && (
                                        <div className="absolute bottom-full z-30 mb-1 w-full rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                            {languages.map((language) => (
                                                <button
                                                    key={language.code}
                                                    type="button"
                                                    onClick={() => {
                                                        const firstVoice = voices[language.code]?.[0];
                                                        setSettings((current) => {
                                                            const updated = {
                                                                ...current,
                                                                language: language.name,
                                                                ...(firstVoice && { voice: firstVoice.id }),
                                                            };
                                                            applySettings(updated);
                                                            return updated;
                                                        });
                                                        closeDropdowns();
                                                    }}
                                                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-text-muted hover:bg-card-hover hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose"
                                                >
                                                    {language.name}
                                                    {settings.language === language.name && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className={label}>Reading voice</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        aria-expanded={voiceOpen}
                                        onClick={() => {
                                            setVoiceOpen(!voiceOpen);
                                            setLanguageOpen(false);
                                        }}
                                        className={control}
                                    >
                                        <span className="truncate">
                                            {filteredVoices.find((voice) => voice.id === settings.voice)?.name || 'Select voice'}
                                        </span>
                                        <ChevronDown size={15} className={`shrink-0 transition-transform motion-reduce:transition-none ${voiceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {voiceOpen && (
                                        <div className="absolute bottom-full z-30 mb-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                            {filteredVoices.map((voice) => (
                                                <button
                                                    key={voice.id}
                                                    type="button"
                                                    onClick={() => {
                                                        update('voice', voice.id);
                                                        setVoiceOpen(false);
                                                    }}
                                                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm text-text-muted hover:bg-card-hover hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose"
                                                >
                                                    <span className="truncate">{voice.name}</span>
                                                    {settings.voice === voice.id && <Check size={14} className="shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-border-subtle bg-app-bg px-3 py-3 sm:px-4">
                        <button
                            type="button"
                            onClick={reset}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-text-muted hover:bg-card-hover hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose"
                        >
                            <RotateCcw size={13} /> Reset
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={cancel}
                                className="rounded-lg px-3 py-2 text-xs text-text-muted hover:bg-card-hover hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={save}
                                disabled={!hasChanges}
                                className="rounded-lg bg-primary-rose px-3.5 py-2 text-xs font-medium text-app-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose focus-visible:ring-offset-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}