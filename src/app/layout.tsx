import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NextAuthProvider from "@/app/context/NextAuthProvider";
import Header from "@/app/components/Header";

const inconsolata = Inconsolata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typing",
  description: "Typing app for massive improvement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inconsolata.className}>
        <NextAuthProvider>
          <div className="w-full">
            <Header />
          </div>
          <div className="w-full">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
