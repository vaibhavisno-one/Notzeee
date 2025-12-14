"use client";

import { useState } from "react";
import { ArrowRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeAppPreview() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Main Preview Card */}
            <div className="relative z-10">
                <div
                    className="group border border-neutral-200 rounded-lg overflow-hidden shadow-sm bg-neutral-50 aspect-[16/10] relative flex cursor-default transition-all hover:shadow-md"
                    onClick={() => setIsOpen(true)}
                >
                    {/* App Screenshot - Thumbnail */}
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.02] origin-top">
                        <motion.img
                            layoutId="app-preview-image"
                            src="/app-screenshot.png"
                            alt="Notzeee App Interface"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* Hover Blur Overlay - Trigger */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 z-10 cursor-pointer"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(true);
                            }}
                            className="bg-white px-6 py-3 rounded-full shadow-lg border border-neutral-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <span className="font-editorial font-medium text-neutral-900">Deep Focus Mode</span>
                            <Maximize2 size={14} className="text-neutral-400" />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-white/60 backdrop-blur-xl"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Image Container */}
                        <div
                            className="relative w-full max-w-7xl z-20 pointer-events-none flex items-center justify-center p-4"
                            style={{ height: '90vh' }}
                        >
                            {/* Full Image */}
                            <motion.img
                                layoutId="app-preview-image"
                                src="/app-screenshot.png"
                                alt="Notzeee App Interface Full"
                                className="w-full h-full object-contain pointer-events-auto rounded-3xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // Prevent close on image click
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
