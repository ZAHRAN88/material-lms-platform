import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollRange from "@/components/ScrollRange";
import { SiteBlob } from "@/components/SiteBlob";
import OnlineStatus from "@/components/OnlineStatus";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuthProvider } from "@/lib/AuthContext";

gsap.registerPlugin(ScrollTrigger);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AC Material by Mohamed Zahran",
  description: "Easy to learn , SHA Students ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
          >
            <SiteBlob/>
            <OnlineStatus />
            <ScrollRange />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}