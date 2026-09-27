import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { AccountProvider } from "@/components/account-store";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Neend — Bedding", template: "%s — Neend" },
  description: "Cotton bedsheets, comforters and duvet covers. Delivered across Pakistan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen">
        <AccountProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
