import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Cart } from "@/components/Cart/Cart"; // 1. Імпортуй кошик
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" data-scroll-behavior="smooth">
      <body>
        <Toaster />
        <Header />
        <Cart />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
