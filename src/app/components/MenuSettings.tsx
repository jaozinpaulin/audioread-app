// @ts-nocheck

'use client';

import { useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';

const textSizes = ['Small', 'Medium', 'Large', 'Extra large'];
const themes = ['System', 'Light', 'Dark'];
const languages = ['Português', 'English', 'Español'];
const voices = ['Voice 1', 'Voice 2', 'Voice 3', 'Voice 4'];

const initialSettings = {
    speed: 1,
    pitch: 1,
    textSize: 'Small',
    theme: 'System',
    language: 'English',
    voice: 'Voice 1',
};

export default function MenuSettings({ isOpen, setIsOpen }) {
    const [settings, setSettings] = useState(initialSettings);
    const [savedSettings, setSavedSettings] = useState(initialSettings);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);

    function update(key, value) {
        setSettings((current) => ({ ...current, [key]: value }));
    }

    function reset() {
        setSettings({ ...initialSettings });
    }

    function cancel() {
        setSettings({ ...savedSettings });
        setIsOpen(false);
    }

    function save() {
        setSavedSettings({ ...settings });
        setIsOpen(false);
    }

    const label = 'mb-2 block text-xs text-text-muted';
    const control = 'w-full rounded-lg border border-border-subtle bg-card-bg p-2.5 text-sm outline-none';
    const range = 'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border-subtle accent-primary-rose';
    const option = 'w-full rounded-md py-2 text-xs text-center transition-colors';

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Reading settings"
                className="rounded-xl border border-border-subtle bg-card-bg p-2.5 text-text-muted transition-colors hover:text-text-main"
            >
                <SlidersHorizontal size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border-subtle bg-app-bg p-4 shadow-xl">
                    <h2 className="mb-5 text-sm font-semibold">
                        Reading settings
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className={label}>
                                Reading speed · {settings.speed.toFixed(1)}x
                            </label>

                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.speed}
                                onChange={(e) => update('speed', Number(e.target.value))}
                                className={range}
                            />
                        </div>

                        <div>
                            <label className={label}>
                                Voice pitch · {settings.pitch.toFixed(1)}
                            </label>

                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={settings.pitch}
                                onChange={(e) => update('pitch', Number(e.target.value))}
                                className={range}
                            />
                        </div>

                        <div>
                            <label className={label}>Text size</label>

                            <div className="grid w-full grid-cols-4 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
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

                        <div>
                            <label className={label}>Appearance</label>

                            <div className="grid w-full grid-cols-3 gap-1 rounded-lg border border-border-subtle bg-card-bg p-1">
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
                                    <span className="flex items-center justify-between">
                                        {settings.language}
                                        <ChevronDown size={16} />
                                    </span>
                                </button>

                                {languageOpen && (
                                    <div className="absolute top-full z-20 mt-1 w-full rounded-lg border border-border-subtle bg-card-bg p-1">
                                        {languages.map((language) => (
                                            <button
                                                key={language}
                                                onClick={() => {
                                                    update('language', language);
                                                    setLanguageOpen(false);
                                                }}
                                                className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-card-hover"
                                            >
                                                {language}
                                                {settings.language === language && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={label}>Reading voice</label>

                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setVoiceOpen(!voiceOpen);
                                        setLanguageOpen(false);
                                    }}
                                    className={control}
                                >
                                    <span className="flex items-center justify-between">
                                        {settings.voice}
                                        <ChevronDown size={16} />
                                    </span>
                                </button>

                                {voiceOpen && (
                                    <div className="absolute bottom-full z-20 mb-1 max-h-36 w-full overflow-y-auto rounded-lg border border-border-subtle bg-card-bg p-1">
                                        {voices.map((voice) => (
                                            <button
                                                key={voice}
                                                onClick={() => {
                                                    update('voice', voice);
                                                    setVoiceOpen(false);
                                                }}
                                                className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-card-hover"
                                            >
                                                {voice}
                                                {settings.voice === voice && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-3">
                        <button
                            onClick={reset}
                            className="text-xs text-text-muted transition-colors hover:text-text-main"
                        >
                            Reset
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={cancel}
                                className="text-xs text-text-muted transition-colors hover:text-text-main"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={save}
                                className="text-xs font-medium text-primary-rose transition-colors hover:text-accent-crimson"
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
