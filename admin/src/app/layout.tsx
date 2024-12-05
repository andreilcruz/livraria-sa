import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Admin: Livraria SA",
  description: "Administração da Livraria SA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
