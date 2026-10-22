// @ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
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
    pitch: 1,
    textSize: 'Small',
    theme: 'System',
    language: 'English',
    voice: 'en-US-JennyNeural',
};

export default function MenuSettings({ isOpen, setIsOpen, onVoiceChange, onTextSizeChange }) {
    const [settings, setSettings] = useState(initialSettings);
    const [savedSettings, setSavedSettings] = useState(initialSettings);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);

    const languageCode = languages.find(
        (language) => language.name === settings.language
    )?.code;

    const filteredVoices = voices[languageCode] || [];

    function update(key, value) {
        setSettings((current) => ({ ...current, [key]: value }));

        if (key === 'voice') {
            onVoiceChange?.(value);
        }
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme.toLowerCase();
    }

    useEffect(() => {
        document.documentElement.dataset.theme = settings.theme.toLowerCase();
    }, [settings.theme]);


    function reset() {
        setSettings({ ...initialSettings });
        applyTheme(initialSettings.theme);
        onVoiceChange?.(initialSettings.voice);
        setLanguageOpen(false);
        setVoiceOpen(false);
    }

    function cancel() {
        setSettings({ ...savedSettings });
        applyTheme(savedSettings.theme);
        onVoiceChange?.(savedSettings.voice);
        setLanguageOpen(false);
        setVoiceOpen(false);
        setIsOpen(false);
    }

    function save() {
        setSavedSettings({ ...settings });
        applyTheme(settings.theme);
        onVoiceChange?.(settings.voice);
        onTextSizeChange?.(settings.textSize);
        setIsOpen(false);
    }

    const label = 'mb-2 block text-xs font-medium text-text-muted';
    const control =
        'flex w-full items-center justify-between rounded-lg border border-border-subtle bg-card-bg px-3 py-2.5 text-sm text-text-main outline-none transition-colors hover:border-primary-rose/50 focus:border-primary-rose';
    const option =
        'rounded-md py-2 text-xs transition-colors';

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Reading settings"
                aria-expanded={isOpen}
                className={`rounded-lg border p-2.5 transition-colors ${isOpen
                    ? 'border-primary-rose/50 bg-card-hover text-text-main'
                    : 'border-border-subtle bg-card-bg text-text-muted hover:text-text-main'
                    }`}
            >
                <SlidersHorizontal size={19} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-visible rounded-xl border border-border-subtle bg-app-bg shadow-2xl">
                    <div className="border-b border-border-subtle px-4 py-3.5">
                        <h2 className="text-sm font-semibold text-text-main">
                            Reading settings
                        </h2>
                        <p className="mt-1 text-xs text-text-muted">
                            Customize your reading experience.
                        </p>
                    </div>

                    <div className="max-h-[70vh] space-y-5 overflow-y-auto p-4">
                        <div>
                            <div className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="text-xs text-text-muted">
                                            Reading speed
                                        </label>
                                        <span className="text-xs font-medium text-text-main">
                                            {settings.speed.toFixed(1)}x
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2"
                                        step="0.1"
                                        value={settings.speed}
                                        onChange={(e) =>
                                            update('speed', Number(e.target.value))
                                        }
                                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose"
                                    />
                                    <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                                        <span>0.5x</span>
                                        <span>2.0x</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <div>
                                <label className={label}>Text size</label>

                                <div className="grid grid-cols-4 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
                                    {textSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => update('textSize', size)}
                                            className={`${option} px-1 ${settings.textSize === size
                                                ? 'bg-primary-rose text-app-bg'
                                                : 'text-text-muted hover:bg-card-hover hover:text-text-main'
                                                }`}
                                        >
                                            {size === 'Extra large' ? 'XL' : size[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className={label}>Appearance</label>

                                <div className="grid grid-cols-3 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme}
                                            onClick={() => update('theme', theme)}
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
                        </div>

                        <div className="border-t border-border-subtle pt-4">
                            <div>
                                <label className={label}>Language</label>

                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setLanguageOpen(!languageOpen);
                                            setVoiceOpen(false);
                                        }}
                                        className={control}
                                    >
                                        <span>{settings.language}</span>
                                        <ChevronDown
                                            size={15}
                                            className={`transition-transform ${languageOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {languageOpen && (
                                        <div className="absolute bottom-full z-30 mb-1 w-full rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                            {languages.map((language) => (
                                                <button
                                                    key={language.code}
                                                    onClick={() => {
                                                        const firstVoice =
                                                            voices[language.code]?.[0];

                                                        update('language', language.name);

                                                        if (firstVoice) {
                                                            update('voice', firstVoice.id);
                                                        }

                                                        setLanguageOpen(false);
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
                            </div>

                            <div className="mt-4">
                                <label className={label}>Reading voice</label>

                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setVoiceOpen(!voiceOpen);
                                            setLanguageOpen(false);
                                        }}
                                        className={control}
                                    >
                                        <span className="truncate">
                                            {filteredVoices.find(
                                                (voice) => voice.id === settings.voice
                                            )?.name || 'Select voice'}
                                        </span>

                                        <ChevronDown
                                            size={15}
                                            className={`shrink-0 transition-transform ${voiceOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {voiceOpen && (
                                        <div className="absolute bottom-full z-30 mb-1 max-h-80 w-full overflow-y-auto rounded-lg border border-border-subtle bg-card-bg p-1 shadow-xl">
                                            {filteredVoices.map((voice) => (
                                                <button
                                                    key={voice.id}
                                                    onClick={() => {
                                                        update('voice', voice.id);
                                                        setVoiceOpen(false);
                                                    }}
                                                    className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                                                >
                                                    <span className="truncate">{voice.name}</span>

                                                    {settings.voice === voice.id && (
                                                        <Check size={14} className="shrink-0" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
                        <button
                            onClick={reset}
                            className="text-xs text-text-muted transition-colors hover:text-text-main"
                        >
                            Reset
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={cancel}
                                className="rounded-md px-2 py-1.5 text-xs text-text-muted transition-colors hover:bg-card-hover hover:text-text-main"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={save}
                                className="rounded-md bg-primary-rose px-3 py-1.5 text-xs font-medium text-app-bg transition-colors hover:opacity-90"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
