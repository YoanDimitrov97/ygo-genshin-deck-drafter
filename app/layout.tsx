import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teyvat Duel Codex v1.1",
  description: "Build a 40-card deck, one choice of three at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
