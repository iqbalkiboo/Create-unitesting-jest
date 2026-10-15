import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager — Next.js + Zustand + OOP",
  description: "Aplikasi manajemen tugas dengan Next.js, Zustand, dan arsitektur OOP yang diuji dengan Jest.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="antialiased">
        <div className="bg-mesh" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        {children}
      </body>
    </html>
  );
}
