// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Check,
    ChevronDown,
    RotateCcw,
    SlidersHorizontal,
    Volume2,
} from 'lucide-react';

import { voices } from '../services/tts';

const textSizes = ['Small', 'Medium', 'Large', 'Extra large'];
const themes = ['System', 'Light', 'Dark'];

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

export default function MenuSettings({ isOpen, setIsOpen, onVoiceChange, onTextSizeChange, onVolumeChange, }) {
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
                const restored = {
                    ...initialSettings,
                    ...JSON.parse(saved),
                };

                setSettings(restored);
                setSavedSettings(restored);
                savedSettingsRef.current = restored;

                document.documentElement.dataset.theme =
                    restored.theme.toLowerCase();

                onVoiceChange?.(restored.voice);
                onTextSizeChange?.(restored.textSize);
                onVolumeChange?.(restored.volume);
            } else {
                document.documentElement.dataset.theme =
                    initialSettings.theme.toLowerCase();
            }
        } catch {
            localStorage.removeItem('userSettings');
        } finally {
            setCarregado(true);
        }
    }, []);

    const hasChanges =
        JSON.stringify(settings) !== JSON.stringify(savedSettings);

    const languageCode = languages.find(
        (language) => language.name === settings.language
    )?.code;

    const filteredVoices = voices[languageCode] || [];

    function applySettings(nextSettings) {
        document.documentElement.dataset.theme =
            nextSettings.theme.toLowerCase();

        onVoiceChange?.(nextSettings.voice);
        onTextSizeChange?.(nextSettings.textSize);
        onVolumeChange?.(nextSettings.volume);
    }

    useEffect(() => {
        if (!carregado || !isOpen) return;

        document.documentElement.dataset.theme =
            settings.theme.toLowerCase();

        onVoiceChange?.(settings.voice);
        onTextSizeChange?.(settings.textSize);
        onVolumeChange?.(settings.volume);
    }, [
        settings,
        carregado,
        isOpen,
        onVoiceChange,
        onTextSizeChange,
        onVolumeChange,
    ]);

    function update(key, value) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
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
        localStorage.setItem(
            'userSettings',
            JSON.stringify(settings)
        );

        const nextSavedSettings = { ...settings };

        setSavedSettings(nextSavedSettings);
        savedSettingsRef.current = nextSavedSettings;

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
            if (
                menuRef.current?.contains(event.target) ||
                buttonRef.current?.contains(event.target)
            ) {
                return;
            }

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
            document.removeEventListener(
                'pointerdown',
                handleOutsideClick
            );

            document.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, [isOpen, carregado, savedSettings]);

    const label = 'mb-2 block text-xs font-medium text-text-muted';

    const control =
        'flex w-full items-center justify-between gap-3 rounded-lg border border-border-subtle bg-card-bg px-3 py-2.5 text-sm text-text-main outline-none transition-colors hover:border-primary-rose/50 focus-visible:border-primary-rose focus-visible:ring-2 focus-visible:ring-primary-rose/20';

    const option =
        'rounded-md py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rose/40';

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
                onClick={() => {
                    if (isOpen) {
                        cancel();
                    } else {
                        setIsOpen(true);
                    }
                }}
                aria-label="Reading settings"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className={`rounded-lg border p-2.5 transition-colors ${isOpen
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
                    className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(75vh,620px)] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border-subtle bg-app-bg shadow-2xl"
                >
                    <div className="flex items-start justify-between border-b border-border-subtle px-4 py-3.5">
                        <div>
                            <h2 className="text-sm font-semibold text-text-main">
                                Reading settings
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-text-muted">
                                Customize your reading experience.
                            </p>
                        </div>

                        {hasChanges && (
                            <span className="mt-0.5 shrink-0 rounded-full bg-primary-rose/10 px-2 py-1 text-[10px] font-medium text-primary-rose">
                                Unsaved
                            </span>
                        )}
                    </div>

                    <div className="space-y-5 overflow-y-auto p-4">
                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="reading-speed"
                                        className="text-xs text-text-muted"
                                    >
                                        Reading speed
                                    </label>

                                    <span className="text-xs font-medium text-text-main">
                                        {settings.speed.toFixed(1)}x
                                    </span>
                                </div>

                                <input
                                    id="reading-speed"
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={settings.speed}
                                    onChange={(event) =>
                                        update(
                                            'speed',
                                            Number(event.target.value)
                                        )
                                    }
                                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose"
                                />

                                <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                                    <span>0.5x</span>
                                    <span>2.0x</span>
                                </div>
                            </div>

                            <div className="border-t border-border-subtle pt-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="reading-volume"
                                        className="flex items-center gap-1.5 text-xs text-text-muted"
                                    >
                                        <Volume2 size={14} />
                                        Volume
                                    </label>

                                    <span className="text-xs font-medium text-text-main">
                                        {Math.round(settings.volume * 100)}%
                                    </span>
                                </div>

                                <input
                                    id="reading-volume"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={settings.volume}
                                    onChange={(event) =>
                                        update(
                                            'volume',
                                            Number(event.target.value)
                                        )
                                    }
                                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose"
                                />
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <label className={label}>Text size</label>

                            <div className="grid grid-cols-4 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
                                {textSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() =>
                                            update('textSize', size)
                                        }
                                        aria-pressed={
                                            settings.textSize === size
                                        }
                                        className={`${option} px-1 ${settings.textSize === size
                                            ? 'bg-primary-rose text-app-bg'
                                            : 'text-text-muted hover:bg-card-hover hover:text-text-main'
                                            }`}
                                    >
                                        {size === 'Extra large'
                                            ? 'XL'
                                            : size[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={label}>Appearance</label>

                            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
                                {themes.map((theme) => (
                                    <button
                                        key={theme}
                                        type="button"
                                        onClick={() =>
                                            update('theme', theme)
                                        }
                                        aria-pressed={
                                            settings.theme === theme
                                        }
                                        className={`${option} px-2 ${settings.theme === theme
                                            ? 'bg-primary-rose text-app-bg'
                                            : 'text-text-muted hover:bg-card-hover hover:text-text-main'
                                            }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
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

                                    <ChevronDown
                                        size={15}
                                        className={`shrink-0 transition-transform ${languageOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {languageOpen && (
                                    <div className="absolute bottom-full z-30 mb-1 w-full rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                        {languages.map((language) => (
                                            <button
                                                key={language.code}
                                                type="button"
                                                onClick={() => {
                                                    const firstVoice =
                                                        voices[language.code]?.[0];

                                                    setSettings((current) => {
                                                        const updated = {
                                                            ...current,
                                                            language: language.name,
                                                            ...(firstVoice && {
                                                                voice: firstVoice.id,
                                                            }),
                                                        };

                                                        applySettings(updated);

                                                        return updated;
                                                    });

                                                    closeDropdowns();
                                                }}
                                                className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                                            >
                                                {language.name}

                                                {settings.language === language.name && (
                                                    <Check size={14} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className={label}>
                                    Reading voice
                                </label>

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
                                            {filteredVoices.find(
                                                (voice) =>
                                                    voice.id === settings.voice
                                            )?.name || 'Select voice'}
                                        </span>

                                        <ChevronDown
                                            size={15}
                                            className={`shrink-0 transition-transform ${voiceOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {voiceOpen && (
                                        <div className="absolute bottom-full z-30 mb-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                            {filteredVoices.map((voice) => (
                                                <button
                                                    key={voice.id}
                                                    type="button"
                                                    onClick={() => {
                                                        update('voice', voice.id);
                                                        setVoiceOpen(false);
                                                    }}
                                                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                                                >
                                                    <span className="truncate">
                                                        {voice.name}
                                                    </span>

                                                    {settings.voice === voice.id && (
                                                        <Check
                                                            size={14}
                                                            className="shrink-0"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-app-bg px-4 py-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="flex items-center gap-1.5 rounded-md px-2 py-2 text-xs text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                        >
                            <RotateCcw size={13} />
                            Reset
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={cancel}
                                className="rounded-md px-3 py-2 text-xs text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={save}
                                disabled={!hasChanges}
                                className="rounded-md bg-primary-rose px-3.5 py-2 text-xs font-medium text-app-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
