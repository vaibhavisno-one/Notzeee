import Link from "next/link";
import { ArrowRight, Lock, Zap, FileText } from "lucide-react";
import HomeAppPreview from "./components/HomeAppPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-50 font-utility selection:bg-neutral-700 selection:text-neutral-50">
      <main className="max-w-3xl mx-auto px-6 py-24 flex flex-col gap-16">

        {/* Hero Section */}
        <section className="flex flex-col gap-6 items-start selection:bg-neutral-700 selection:text-neutral-50">
          <h1 className="text-4xl md:text-5xl font-editorial font-medium tracking-tight text-neutral-50">
            Personal notes for developers.
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-lg leading-relaxed font-editorial">
            Fast, private, and distraction-free. Built for clarity, speed, and focus.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-900 px-5 py-2.5 rounded-md font-medium hover:bg-neutral-200 transition-colors shadow-sm"
          >
            <span>Start Writing</span>
            <ArrowRight size={16} />
          </Link>
        </section>


        <HomeAppPreview />

        <section>
          <h2 className="text-sm font-medium text-neutral-400 mb-8 uppercase tracking-wider">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Lock, title: "Private", desc: "Your notes stay on your device." },
              { icon: FileText, title: "Write", desc: "Markdown-ready rich text editor." },
              { icon: Zap, title: "Save", desc: "Local-first speed, instant persistence." },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-700 text-neutral-300">
                  <f.icon size={16} />
                </div>
                <h3 className="font-medium text-neutral-50">{f.title}</h3>
                <p className="text-sm text-neutral-300 leading-relaxed font-editorial">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-neutral-600 py-12 text-center text-xs text-neutral-400">
        <p>©{new Date().getFullYear()} Notzeee. Built by  <Link href="https://github.com/vaibhavisno-one" target="_blank">vaibhavisno-one</Link></p>
      </footer>
    </div>
  );
}
