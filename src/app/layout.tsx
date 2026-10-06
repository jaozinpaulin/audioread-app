import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AudioRead App",
  description: "Leitor de documentos e livros com suporte a audio e customizacao",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0C] text-[#F8FAFC]">
        <div className="max-w-md w-full mx-auto min-h-screen bg-[#0A0A0C] shadow-2xl relative border-x border-white/5 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}