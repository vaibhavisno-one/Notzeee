import Link from "next/link";
import { ArrowRight, Lock, Zap, FileText } from "lucide-react";

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
        <section className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm bg-neutral-50 aspect-[16/10] relative flex">
          {/* Abstract Sidebar */}
          <div className="w-1/4 h-full border-r border-neutral-200 bg-white p-4 flex flex-col gap-2">
            <div className="h-4 w-20 bg-neutral-100 rounded mb-4" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
            <div className="h-3 w-3/4 bg-neutral-100 rounded" />
            <div className="h-3 w-4/5 bg-neutral-100 rounded" />
          </div>
          {/* Abstract Editor */}
          <div className="flex-1 p-8 flex flex-col gap-4">
            <div className="h-6 w-1/3 bg-neutral-200 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
            <div className="h-3 w-full bg-neutral-100 rounded" />
            <div className="h-3 w-2/3 bg-neutral-100 rounded" />
          </div>
        </section>

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
        <p>© {new Date().getFullYear()} Notzeee. Built with Next.js.</p>
      </footer>
    </div>
  );
}
