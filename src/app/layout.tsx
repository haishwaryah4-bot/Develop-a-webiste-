import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import AIAssistant from "@/components/AIAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackForge | Build. Collaborate. Innovate. - Premier Hackathon Platform",
  description: "The world's leading hackathon platform for developers, organizers, and enterprises. Discover global hackathons, form teams, submit projects, and win prizes.",
  keywords: ["hackathon", "developer platform", "AI hackathons", "coding competition", "web3", "hackathons 2026"],
  openGraph: {
    title: "HackForge | Full-Stack Hackathon Hosting & Discovery Platform",
    description: "Build. Collaborate. Innovate. Join 10,000+ developers building the future of software.",
    url: "https://hackforge.dev",
    siteName: "HackForge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <AuthModal />
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
