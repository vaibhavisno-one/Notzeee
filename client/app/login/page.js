"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await login(formData);

        if (result.success) {
            router.push("/app");
        } else {
            setError(result.error || "Login failed");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-editorial font-medium mb-2">Welcome back</h1>
                    <p className="text-neutral-400">Sign in to your Notzeee account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-md text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                            placeholder="Enter your username or email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-md text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-900 px-5 py-2.5 rounded-md font-medium hover:bg-neutral-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-400 mt-6">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-neutral-50 hover:underline font-medium">
                        Create one
                    </Link>
                </p>

                <Link
                    href="/"
                    className="block text-center text-sm text-neutral-500 hover:text-neutral-300 mt-8 transition-colors"
                >
                    ← Back to home
                </Link>
            </div>
        </div>
    );
}
