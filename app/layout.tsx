import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { LenisInit } from "@/components/LenisInit";
import { NavInteractions } from "@/components/NavInteractions";

export const metadata: Metadata = {
    title: "Applied Archive Atelier",
    description: "Some work is worth doing together.",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="preload"
                    href="/fonts/ABCFavorit-Book.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/ABCFavorit-Medium.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/ABCFavorit-Bold.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin=""
                />
            </head>
            <body className="font-sans antialiased">
                <Navbar />
                {children}
                <LenisInit />
                <NavInteractions />
            </body>
        </html>
    );
}
