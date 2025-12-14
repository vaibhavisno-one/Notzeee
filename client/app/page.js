import Link from "next/link";
import { ArrowRight, Lock, Zap, FileText } from "lucide-react";
import HomeAppPreview from "./components/HomeAppPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-utility selection:bg-neutral-200">
      <main className="max-w-3xl mx-auto px-6 py-24 flex flex-col gap-16">

        {/* Hero Section */}
        <section className="flex flex-col gap-6 items-start">
          <h1 className="text-4xl md:text-5xl font-editorial font-medium tracking-tight text-neutral-900">
            Personal notes for developers.
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-lg leading-relaxed font-editorial">
            Fast, private, and distraction-free. Built for clarity, speed, and focus.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-md font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <span>Continue with Google</span>
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* App Preview / Visual */}
        <HomeAppPreview />

        {/* Features / How it works */}
        <section>
          <h2 className="text-sm font-medium text-neutral-400 mb-8 uppercase tracking-wider">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Lock, title: "Sign in", desc: "Google Auth only. Secure by default." },
              { icon: FileText, title: "Write", desc: "Markdown-ready rich text editor." },
              { icon: Zap, title: "Save", desc: "Local-first speed, cloud persistence." },
            ].map((f, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <f.icon size={16} />
                </div>
                <h3 className="font-medium text-neutral-900">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed font-editorial">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-neutral-100 py-12 text-center text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} Notzeee. Built by vaibhavisno-one <Link href="https://github.com/vaibhavisno-one" target="_blank">GitHub</Link></p>
      </footer>
    </div>
  );
}
