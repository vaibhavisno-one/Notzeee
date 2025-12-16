"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const handleSignIn = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-6">
            <div className="w-full max-w-sm bg-neutral-800 border border-neutral-600 rounded-lg p-8 shadow-sm">
                <div className="mb-8">
                    <Link href="/" className="inline-block text-xl font-bold font-editorial text-neutral-50 mb-2">Notzeee</Link>
                    <h2 className="text-lg font-medium text-neutral-200">Welcome back</h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded text-sm text-red-400 flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>
                            {error === "auth_failed"
                                ? "Authentication failed. Please try again."
                                : "An error occurred. Please try again."}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleSignIn}
                    className="w-full bg-neutral-700 border border-neutral-600 text-neutral-50 font-medium py-2.5 px-4 rounded-md hover:bg-neutral-600 transition-colors flex items-center justify-center gap-3 shadow-sm"
                >
                    {/* Google Icon SVG */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Continue with Google</span>
                </button>

                <p className="mt-8 text-center text-xs text-neutral-500">
                    By clicking continue, you agree to our <span className="underline cursor-pointer hover:text-neutral-300">Terms</span> and <span className="underline cursor-pointer hover:text-neutral-300">Privacy Policy</span>.
                </p>

            </div>
        </div>
    );
}
