/**
 * Editor Utilities
 * 
 * Shared constants and helper functions for the editor
 */

// Font configuration
export const FONTS = [
    { value: 'normal', label: 'Normal', className: 'font-editorial' },
    { value: 'handwritten', label: 'Handwritten', className: 'font-handwritten' },
    { value: 'monospace', label: 'Monospace', className: 'font-mono' }
];

// Highlight color configuration
export const HIGHLIGHT_COLORS = [
    { value: 'yellow', label: 'Yellow', hex: '#fef08a', rgba: 'rgba(254, 240, 138, 0.3)' },
    { value: 'green', label: 'Green', hex: '#86efac', rgba: 'rgba(134, 239, 172, 0.3)' },
    { value: 'blue', label: 'Blue', hex: '#93c5fd', rgba: 'rgba(147, 197, 253, 0.3)' },
    { value: 'pink', label: 'Pink', hex: '#f9a8d4', rgba: 'rgba(249, 168, 212, 0.3)' }
];

// Editor constants
export const LINE_HEIGHT = '2.5rem';
export const TEXTAREA_MIN_HEIGHT = '800px';

/**
 * Get font className for a given font value
 */
export function getFontClassName(fontValue) {
    const font = FONTS.find(f => f.value === fontValue);
    return font ? font.className : 'font-editorial';
}

/**
 * Get highlight color RGBA value
 */
export function getHighlightColor(colorValue) {
    const color = HIGHLIGHT_COLORS.find(c => c.value === colorValue);
    return color ? color.rgba : HIGHLIGHT_COLORS[0].rgba;
}

/**
 * Check if textarea has active selection
 */
export function hasTextSelection(textarea) {
    if (!textarea) return false;
    return textarea.selectionStart !== textarea.selectionEnd;
}

/**
 * Get current selection range from textarea
 */
export function getSelectionRange(textarea) {
    if (!textarea) return null;
    return {
        start: textarea.selectionStart,
        end: textarea.selectionEnd
    };
}
