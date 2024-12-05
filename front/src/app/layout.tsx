import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner'

export const metadata = {
  title: "Livraria SA",
  description: "Venda de livros de diversos gêneros",
  icons: {
    icon: "/favicon.ico",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
