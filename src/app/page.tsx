'use client';

import { useState } from 'react';

export default function Home() {
    const [documents, setDocuments] = useState([
        { id: '1', title: 'Tudo é Rio - Carla Madeira', pages: 121, progress: 45 },
        { id: '2', title: 'Apostila de Desenvolvimento Web - Senac', pages: 85, progress: 70 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    return (
        <main className="flex-1 flex flex-col justify-between p-4 md:p-8 pb-28 md:pb-12">

            <header className="py-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-crimson flex items-center justify-center text-white font-bold">
                    </div>
                    <h1 className="font-bold text-lg md:text-xl tracking-tight text-text-main">Audio Documents</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-card-bg border border-border-subtle hover:bg-card-hover transition-colors text-text-muted">
                    </button>
                    <button className="p-2.5 rounded-xl bg-card-bg border border-border-subtle hover:bg-card-hover transition-colors text-primary-rose">
                    </button>
                </div>
            </header>

            <div className="space-y-6 my-6 flex-1 max-w-3xl w-full mx-auto">

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search documents"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card-bg border border-border-subtle rounded-2xl px-4 py-3.5 text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary-rose transition-all"
                    />
                </div>

                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-card-bg border border-border-subtle hover:border-primary-rose/40 transition-all cursor-pointer hover:bg-card-hover"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-12 rounded-lg bg-accent-crimson/20 border border-accent-crimson/30 flex items-center justify-center text-primary-rose">
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm md:text-base text-text-main">{doc.title}</h3>
                                    <p className="text-xs text-text-muted mt-0.5">{doc.pages} pages</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-xl bg-card-bg text-text-muted hover:text-red-400 transition-colors">
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="max-w-3xl w-full mx-auto space-y-3 pt-4">
                <button className="w-full py-3.5 px-4 rounded-2xl bg-card-bg border border-border-subtle hover:bg-card-hover text-text-main font-medium text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <span>Paste from Clipboard</span>
                </button>

                <button className="w-full py-3.5 px-4 rounded-2xl bg-accent-crimson hover:bg-[#b0453c] text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer">
                    <span>Import Document</span>
                </button>
            </div>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-app-bg border-t border-border-subtle px-6 py-3 flex items-center justify-around z-50">
                <span className="text-xs font-medium text-primary-rose cursor-pointer">Library</span>
                <span className="text-xs font-medium text-text-muted cursor-pointer hover:text-text-main transition-colors">Player</span>
                <span className="text-xs font-medium text-text-muted cursor-pointer hover:text-text-main transition-colors">Settings</span>
            </nav>

        </main>
    );
}