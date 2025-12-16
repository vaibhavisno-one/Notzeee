"use client";

import { useEffect, useRef } from "react";
import { getFontClassName, getHighlightColor } from "../utils/editorUtils";

/**
 * FormattedPreview Component
 * 
 * Renders visual formatting overlay above textarea.
 * Handles: highlights, bold, italic, font styles.
 * Syncs scroll with textarea.
 */
export default function FormattedPreview({
    content,
    textareaRef,
    highlightRanges = [],
    isBold,
    isItalic,
    currentFont
}) {
    const previewRef = useRef(null);

    // Sync scroll position with textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        const preview = previewRef.current;
        if (!textarea || !preview) return;

        const syncScroll = () => {
            preview.scrollTop = textarea.scrollTop;
            preview.scrollLeft = textarea.scrollLeft;
        };

        textarea.addEventListener('scroll', syncScroll);
        return () => textarea.removeEventListener('scroll', syncScroll);
    }, [textareaRef]);

    // Build className string
    const className = [
        'absolute inset-0 overflow-hidden pointer-events-none',
        'whitespace-pre-wrap break-words text-lg text-neutral-100 leading-[2.5rem]',
        getFontClassName(currentFont),
        isBold && 'font-bold',
        isItalic && 'italic'
    ].filter(Boolean).join(' ');

    return (
        <div ref={previewRef} className={className}>
            {renderContent(content, highlightRanges)}
        </div>
    );
}

/**
 * Render content with highlights applied to specific ranges
 */
function renderContent(content, highlightRanges) {
    if (!content) return '';
    if (highlightRanges.length === 0) return content;

    // Recalculate positions based on stored text to handle content changes
    const activeRanges = highlightRanges
        .map(range => {
            // Find the current position of the highlighted text
            const currentIndex = content.indexOf(range.text);
            if (currentIndex === -1) return null; // Text was deleted

            return {
                start: currentIndex,
                end: currentIndex + range.text.length,
                color: range.color,
                text: range.text
            };
        })
        .filter(Boolean) // Remove null entries (deleted text)
        .sort((a, b) => a.start - b.start);

    if (activeRanges.length === 0) return content;

    const segments = [];
    let lastIndex = 0;

    activeRanges.forEach((range, idx) => {
        // Text before highlight
        if (range.start > lastIndex) {
            segments.push(
                <span key={`text-${idx}`}>
                    {content.substring(lastIndex, range.start)}
                </span>
            );
        }

        // Highlighted text - marker-style gradient
        segments.push(
            <mark
                key={`highlight-${idx}`}
                style={{
                    background: `linear-gradient(transparent 60%, ${getHighlightColor(range.color)} 60%)`,
                    color: 'inherit',
                    padding: '0 2px'
                }}
            >
                {content.substring(range.start, range.end)}
            </mark>
        );

        lastIndex = range.end;
    });

    // Remaining text
    if (lastIndex < content.length) {
        segments.push(
            <span key="text-end">
                {content.substring(lastIndex)}
            </span>
        );
    }

    return segments;
}
