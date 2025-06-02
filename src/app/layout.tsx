import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Warning from "@/components/Warning";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased`}
      >
        <Warning />
        <Header />
        {children}
      </body>
    </html>
  );
}
