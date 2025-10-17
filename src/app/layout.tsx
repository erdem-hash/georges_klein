import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Profit Planner",
  description: "Annual Profit Planner for 3 Apartments in France",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
