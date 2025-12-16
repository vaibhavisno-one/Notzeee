"use client";

import { useEffect, useRef } from "react";

/**
 * FormattedPreview Component
 * 
 * Renders a formatted preview overlay that shows visual formatting
 * (highlights, bold, italic) while the textarea below handles input.
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

        const handleScroll = () => {
            preview.scrollTop = textarea.scrollTop;
            preview.scrollLeft = textarea.scrollLeft;
        };

        textarea.addEventListener('scroll', handleScroll);
        return () => textarea.removeEventListener('scroll', handleScroll);
    }, [textareaRef]);

    // Render content with highlights
    const renderFormattedContent = () => {
        if (!content) return '';

        // Sort ranges by start position
        const sortedRanges = [...highlightRanges].sort((a, b) => a.start - b.start);

        let result = [];
        let lastIndex = 0;

        sortedRanges.forEach((range, idx) => {
            // Add text before highlight
            if (range.start > lastIndex) {
                result.push(
                    <span key={`text-${idx}`}>
                        {content.substring(lastIndex, range.start)}
                    </span>
                );
            }

            // Add highlighted text
            const highlightColors = {
                'yellow': 'rgba(254, 240, 138, 0.3)',
                'green': 'rgba(134, 239, 172, 0.3)',
                'blue': 'rgba(147, 197, 253, 0.3)',
                'pink': 'rgba(249, 168, 212, 0.3)'
            };

            result.push(
                <span
                    key={`highlight-${idx}`}
                    style={{ backgroundColor: highlightColors[range.color] || highlightColors.yellow }}
                >
                    {content.substring(range.start, range.end)}
                </span>
            );

            lastIndex = range.end;
        });

        // Add remaining text
        if (lastIndex < content.length) {
            result.push(
                <span key="text-end">
                    {content.substring(lastIndex)}
                </span>
            );
        }

        return result;
    };

    // Get font class
    const getFontClass = () => {
        if (currentFont === 'handwritten') return 'font-handwritten';
        if (currentFont === 'monospace') return 'font-mono';
        return 'font-editorial';
    };

    return (
        <div
            ref={previewRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none whitespace-pre-wrap break-words text-lg text-neutral-100 leading-[2.5rem] ${getFontClass()} ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
            style={{
                padding: '0',
                lineHeight: '2.5rem',
            }}
        >
            {renderFormattedContent()}
        </div>
    );
}
