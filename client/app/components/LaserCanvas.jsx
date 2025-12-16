"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/**
 * LaserCanvas Component
 * 
 * Provides a temporary drawing overlay for laser pen annotations.
 * Strokes fade out automatically and don't modify the note content.
 */
export default function LaserCanvas({ isActive, onDeactivate }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokes, setStrokes] = useState([]);
    const animationFrameRef = useRef(null);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Drawing logic
    const startDrawing = useCallback((e) => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStrokes(prev => [...prev, {
            points: [{ x, y }],
            timestamp: Date.now(),
            opacity: 1
        }]);
    }, [isActive]);

    const draw = useCallback((e) => {
        if (!isDrawing || !isActive) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setStrokes(prev => {
            const updated = [...prev];
            const currentStroke = updated[updated.length - 1];
            currentStroke.points.push({ x, y });
            return updated;
        });
    }, [isDrawing, isActive]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    // Render strokes and handle fade-out
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            let hasActiveStrokes = false;

            strokes.forEach((stroke, index) => {
                const age = now - stroke.timestamp;
                const fadeStart = 2000; // Start fading after 2 seconds
                const fadeDuration = 1000; // Fade over 1 second

                let opacity = 1;
                if (age > fadeStart) {
                    opacity = Math.max(0, 1 - (age - fadeStart) / fadeDuration);
                }

                if (opacity > 0) {
                    hasActiveStrokes = true;

                    ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`; // Red with opacity
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `rgba(251, 146, 60, ${opacity * 0.6})`; // Orange glow

                    ctx.beginPath();
                    stroke.points.forEach((point, i) => {
                        if (i === 0) {
                            ctx.moveTo(point.x, point.y);
                        } else {
                            ctx.lineTo(point.x, point.y);
                        }
                    });
                    ctx.stroke();
                }
            });

            // Clean up faded strokes
            if (!hasActiveStrokes && strokes.length > 0) {
                setStrokes([]);
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [strokes]);

    // Mouse event handlers
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        };
    }, [startDrawing, draw, stopDrawing]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-50 cursor-crosshair"
            style={{ touchAction: 'none' }}
        />
    );
}
