import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Simple Chat App",
  description: "Sebuah chat sederhana dengan Next.js 13",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-green-700 text-white p-4">
          <h1 className="text-xl font-bold">Chat App</h1>
        </header>
        <main className="flex-grow p-4">{children}</main>
        <footer className="bg-green-900 text-white p-2 text-center text-sm">
          © 2024 Chat App
        </footer>
      </body>
    </html>
  );
}
