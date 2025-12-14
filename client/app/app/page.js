"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AppPage() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center text-neutral-400 bg-white">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-sm">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold font-editorial text-neutral-900">Notzeee</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {user?.avatar && (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <div className="text-sm">
                            <p className="font-medium text-neutral-900">{user?.name}</p>
                            <p className="text-neutral-500 text-xs">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm text-neutral-600 hover:text-neutral-900 px-3 py-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col h-full flex-1 items-center justify-center text-neutral-400">
                    <p className="text-sm">Select a note to view</p>
                </div>
            </div>
        </div>
    );
}
