import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analyse de Rentabilité - Immeuble (Sélestat, France)",
  description: "Outil d'analyse de rentabilité pour 8 Rue Georges Klein, Sélestat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} min-h-screen bg-fixed bg-center bg-cover`}
        style={{
          backgroundImage: "url('/selestat-bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-white/80 backdrop-blur-md min-h-screen">
          <main className="container mx-auto px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
