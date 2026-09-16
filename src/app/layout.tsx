import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from 'next/link';
import Header from '@/components/Header';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "RoshSpark Cricket Stadium | Telemetry & Operations",
  description: "The official digital platform for RoshSpark Cricket Stadium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-obsidian text-slate-200 font-sans min-h-screen selection:bg-emeraldGlow selection:text-black antialiased">
        
        <Header />

        {children}

      </body>
    </html>
  );
}
