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
            <div className="flex flex-col h-screen items-center justify-center text-neutral-500 bg-neutral-900">
                <Loader2 className="animate-spin mb-2" size={24} />
                <p className="text-sm">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-neutral-900">
            {/* Header */}
            <header className="border-b border-neutral-600 px-6 py-4 flex items-center justify-between bg-neutral-800">
                <h1 className="text-xl font-bold font-editorial text-neutral-50">Notzeee</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {user?.avatar && (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full ring-2 ring-neutral-600"
                            />
                        )}
                        <div className="text-sm">
                            <p className="font-medium text-neutral-50">{user?.name}</p>
                            <p className="text-neutral-300 text-xs">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm text-neutral-300 hover:text-neutral-50 px-3 py-1.5 border border-neutral-600 rounded-md hover:bg-neutral-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col h-full flex-1 items-center justify-center text-neutral-500">
                    <p className="text-sm">Select a note to view</p>
                </div>
            </div>
        </div>
    );
}
