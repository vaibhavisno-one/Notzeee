/**
 * Markup Parser for Note Editor
 * 
 * Handles parsing and rendering of lightweight markup syntax:
 * - Highlights: ==text== (yellow), ==g:text== (green), ==b:text== (blue), ==p:text== (pink)
 * - Text Colors: {c:red}text{/c}, {c:blue}text{/c}, etc.
 */

// Escape HTML to prevent XSS
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Parse markup syntax and convert to HTML
 * @param {string} text - Raw text with markup
 * @returns {string} - HTML string with styled elements
 */
export const parseMarkup = (text) => {
    if (!text) return '';

    let html = escapeHtml(text);

    // Parse highlights with color prefixes
    // ==p:text== -> pink, ==g:text== -> green, ==b:text== -> blue, ==text== -> yellow (default)
    html = html.replace(/==([pgb]):([^=]+)==/g, (match, color, content) => {
        const colorMap = {
            'p': 'pink',
            'g': 'green',
            'b': 'blue'
        };
        return `<mark class="highlight-${colorMap[color]}">${content}</mark>`;
    });

    // Default yellow highlight
    html = html.replace(/==([^=:]+)==/g, '<mark class="highlight-yellow">$1</mark>');

    // Parse text colors
    // {c:red}text{/c} -> colored text
    html = html.replace(/\{c:(\w+)\}([^{]+)\{\/c\}/g, (match, color, content) => {
        return `<span class="text-color-${color}">${content}</span>`;
    });

    // Preserve line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
};

/**
 * Strip all markup from text (for export/search)
 * @param {string} text - Text with markup
 * @returns {string} - Plain text without markup
 */
export const stripMarkup = (text) => {
    if (!text) return '';

    return text
        .replace(/==([pgb]):([^=]+)==/g, '$2')  // Remove colored highlights
        .replace(/==([^=:]+)==/g, '$1')          // Remove yellow highlights
        .replace(/\{c:\w+\}([^{]+)\{\/c\}/g, '$1'); // Remove text colors
};

/**
 * Insert highlight markup around selected text
 * @param {string} text - Full text content
 * @param {number} start - Selection start position
 * @param {number} end - Selection end position
 * @param {string} color - Highlight color (yellow, green, blue, pink)
 * @returns {string} - Updated text with highlight markup
 */
export const insertHighlight = (text, start, end, color = 'yellow') => {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const colorPrefix = {
        'yellow': '',
        'green': 'g:',
        'blue': 'b:',
        'pink': 'p:'
    };

    const prefix = colorPrefix[color] || '';
    return `${before}==${prefix}${selected}==${after}`;
};

/**
 * Insert text color markup around selected text
 * @param {string} text - Full text content
 * @param {number} start - Selection start position
 * @param {number} end - Selection end position
 * @param {string} color - Text color name
 * @returns {string} - Updated text with color markup
 */
export const insertColor = (text, start, end, color) => {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    return `${before}{c:${color}}${selected}{/c}${after}`;
};

/**
 * Check if text has any markup
 * @param {string} text - Text to check
 * @returns {boolean} - True if markup exists
 */
export const hasMarkup = (text) => {
    if (!text) return false;
    return /==/.test(text) || /\{c:/.test(text);
};
