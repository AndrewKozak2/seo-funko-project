import { Suspense } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Cart } from "@/components/Cart/Cart";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Funko Pop Store | Buy Exclusive Figures & Bundles",
  description:
    "The ultimate destination for Funko Pop collectors. Shop exclusive Marvel, Formula 1, and Anime figures. Fast shipping and great deals!",
  keywords: [
    "Funko Pop",
    "buy figures",
    "exclusive Funko",
    "Marvel collectibles",
    "F1 Funko",
    "Anime figures",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Toaster />
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <Cart />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
