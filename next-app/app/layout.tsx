import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar/NavBar";
import { ClerkProvider } from '@clerk/nextjs';
import ContextProvider from "./providers/ContextProvider";
import NextTopLoader from "nextjs-toploader";
import Footer from "./components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking",
  description: "The important thing about the journey is the experience!",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en" data-theme="cupcake">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer" />
          <link rel="stylesheet" href="https://cdn.datatables.net/2.0.3/css/dataTables.dataTables.css" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        </head>
        <body className={inter.className}>
          <NextTopLoader
            height={2}
            color="#0ea5e9"
            easing="cubic-bezier(0.53,0.21,0,1)"
            showSpinner={false}
          />
          <ContextProvider>
            <NavBar />
            {children}
            <Footer />
          </ContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
