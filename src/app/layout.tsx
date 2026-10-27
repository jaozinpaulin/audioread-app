import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DocumentProvider } from "./providers/DocumentProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Letrê",
  description: "Leitor de documentos com suporte a áudio e personalização.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="system"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-app-bg text-text-main">
        <div className="relative flex min-h-screen w-full flex-col">
          <DocumentProvider>
            {children}
          </DocumentProvider>
        </div>
      </body>
    </html>
  );
}
