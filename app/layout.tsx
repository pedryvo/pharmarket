import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-pjs",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pharmarket.vercel.app'),
  title: "VitaLab · Sistema de Fórmulas Manipuladas",
  description: "Plataforma premium para criação e gestão de fórmulas manipuladas personalizadas.",
  keywords: ["farmácia", "manipulação", "fórmulas", "vitalab", "saúde"],
  authors: [{ name: "VitaLab Team" }],
  creator: "VitaLab",
  publisher: "VitaLab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "VitaLab · Sistema de Fórmulas Manipuladas",
    description: "Plataforma premium para criação e gestão de fórmulas manipuladas personalizadas.",
    url: "https://pharmarket.vercel.app",
    siteName: "VitaLab",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaLab · Sistema de Fórmulas Manipuladas",
    description: "Plataforma premium para criação e gestão de fórmulas manipuladas personalizadas.",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${spaceMono.variable} antialiased font-sans`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
