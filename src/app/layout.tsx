import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Warning from "@/components/Warning";
import ScrollTop from "@/components/ScrollTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata = {
  title: "Boobie King | Encontre a sua loja mais próxima",
  description: "Projeto de estudo desenvolvido para encontrar a loja mais próxima dentro da ação do Burguer King.",
};

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
        <ScrollTop />
      </body>
    </html>
  );
}
