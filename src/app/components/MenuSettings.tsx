// @ts-nocheck
'use client';

import { ChevronRight, SlidersHorizontal } from "lucide-react"
import { useState } from "react";

const text = [
    { size: "text-lg", name: "small" },
    { size: "text-2xl", name: "medium" },
    { size: "text-3xl", name: "large" },
    { size: "text-4xl", name: "extra lage" }
]

const systemTheme = ["system", "light", "dark"];

const lenguage = ["portugues", "ingles", "espanhol"];
const voices = ["voice1", "voice2", "voice3", "voice4", "voice5", "voice6", "voice8",]


export default function MenuSettings({ isOpen, setIsOpen }) {
    const [sizeActive, setSizeActive] = useState("small");
    const [systemThemeActive, setSystemThemeActive] = useState("system");
    const [lenguageActive, setLenguageActive] = useState("ingles")
    const [languegeOpen, setLanguegeOpen] = useState(false);

    const [voiceActive, setVoiceActive] = useState("voice1")
    const [voiceOpen, setVoiceOpen] = useState(false);



    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Menu configuracoes acessibilidade"
                className={`flex items-center justify-center rounded-xl cursor-pointer border p-2.5 transition-colors ${isOpen
                    ? 'border-zinc-700 bg-zinc-900 text-zinc-100'
                    : 'border-zinc-800/50 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
                    }`}>
                <SlidersHorizontal className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full  z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black/20">

                    <div className="mb-4 border-b border-zinc-800/70 pb-3">
                        <h2 className="text-sm font-semibold text-zinc-100">
                            settings
                        </h2>
                    </div>

                    <div className="space-y-1 flex flex-col">
                        <label>reading speead</label>
                        <input type="range" />

                        <label>plitch</label>
                        <input type="range" />

                        <label>text size</label>

                        <div className="flex  bg-r-zinc-600 rounded-2xl">

                            {text.map((typeSize, index) => (
                                <button
                                    key={index}
                                    className={`p-2  ${sizeActive === typeSize.name ? "bg-rose-800" : "bg-zinc-800"} `}>

                                    {typeSize.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-zinc-600 rounded-2xl">
                            {systemTheme.map((theme, index) => (
                                <button
                                    key={index}
                                    className={`p-2 w-full ${theme === systemThemeActive ? "bg-rose-800" : "bg-zinc-800"} `}>

                                    {theme}
                                </button>
                            ))}
                        </div>


                        <div className="relative bg-zinc-800 rounded">

                            <button
                                onClick={() => setLanguegeOpen(!languegeOpen)}
                                className="p-1 rounded-2xl text-zinc-100">{lenguageActive}</button>

                            {languegeOpen && (
                                <div className="absolute  bg-zinc-800 flex gap-3 flex-col items-start p-2">
                                    {lenguage.map((lang, index) => (
                                        <button key={index}
                                            onClick={() => setLanguegeOpen(false)}
                                            className="p-1 rounded-2xl  text-zinc-100">
                                            {lang}

                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative bg-zinc-800 rounded">

                            <button
                                onClick={() => setVoiceOpen(!voiceOpen)}
                                className="p-1 rounded-2xl text-zinc-100">{voiceActive}</button>

                            {voiceOpen && (
                                <div className="absolute  bg-zinc-800 flex gap-3 flex-col items-start p-2">
                                    {voices.map((voice, index) => (
                                        <button key={index}
                                            onClick={() => setVoiceOpen(false)}
                                            className="p-1 rounded-2xl  text-zinc-100">
                                            {voice}

                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="items-center justify-between bg-zinc-800/70 w-full flex gap-3 p-3">
                        <button className="text-rose-800 text-sm">defalt</button>
                        <button className="text-rose-800 text-sm">cencel</button>
                        <button className="text-rose-800 text-sm">save</button>
                    </div>
                </div>
            )}
        </>
    )

}


