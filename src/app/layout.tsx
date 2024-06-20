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
          <div className="fixed top-0 left-0 w-full z-10">
            <div className="max-w-7xl mx-auto w-full">
              <Header />
            </div>
          </div>
          <div className="">
            <div className=" bg-slate-950 flex items-center w-full justify-center">
              <div className="max-w-7xl w-full">{children}</div>
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
