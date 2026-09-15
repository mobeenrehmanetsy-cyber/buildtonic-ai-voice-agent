import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "./refinements.css";
import "./architecture.css";
import "./voice/assistant.css";
import { Header } from "./components/header";
import { Footer } from "./ui";
import { VoiceAssistant } from "./voice/assistant";
const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const serif = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://buildtonic-ai-voice-agent.vercel.app"),
  title: {
    default: "Buildtonic | Heritage & Residential Construction",
    template: "%s | Buildtonic",
  },
  description:
    "Considered heritage and residential construction across Hampshire, Surrey and London. Explore Buildtonic’s restoration, renovation and new-build expertise.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Buildtonic | Heritage & Residential Construction",
    description: "A respect for the past. A vision for what’s next.",
    locale: "en_GB",
    type: "website",
    images: [
      { url: "/images/projects/rose-cottage-cover.jpg", alt: "Rose Cottage, Hampshire" },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <VoiceAssistant />
      </body>
    </html>
  );
}
