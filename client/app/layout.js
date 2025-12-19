import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Notzeee | Developer Notes",
  description: "Fast, private, and distraction-free notes for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased bg-neutral-900 text-neutral-50 selection:bg-neutral-700 selection:text-neutral-50`}
      >
        {children}
      </body>
    </html>
  );
}
