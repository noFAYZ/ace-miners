// utils/userAgent.js

/**
 * Parse user agent string to extract useful information
 * @param {string} userAgentString - The full user agent string
 * @returns {object} Parsed user agent information
 */
export function parseUserAgent(userAgentString) {
    if (!userAgentString) return {};

    // Simple parsing logic - you might want to use a more robust library in production
    const browserPatterns = [
        { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
        { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
        { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
        { name: 'Edge', regex: /Edg(e)?\/([0-9.]+)/ },
        { name: 'IE', regex: /MSIE ([0-9.]+)/ },
        { name: 'Opera', regex: /OPR\/([0-9.]+)/ },
    ];

    const osPatterns = [
        { name: 'Windows', regex: /Windows NT ([0-9.]+)/ },
        { name: 'Mac', regex: /Macintosh;.*Mac OS X ([0-9_]+)/ },
        { name: 'iOS', regex: /iPhone OS ([0-9_]+)/ },
        { name: 'Android', regex: /Android ([0-9.]+)/ },
        { name: 'Linux', regex: /Linux/ },
    ];

    const devicePatterns = [
        { name: 'Mobile', regex: /Mobile/ },
        { name: 'Tablet', regex: /Tablet/ },
        { name: 'iPad', regex: /iPad/ },
        { name: 'iPhone', regex: /iPhone/ },
    ];

    let result = {
        fullString: userAgentString,
        browser: { name: 'Unknown', version: 'Unknown' },
        os: { name: 'Unknown', version: 'Unknown' },
        device: 'Desktop', // Default
    };

    // Detect browser
    for (const pattern of browserPatterns) {
        const match = userAgentString.match(pattern.regex);
        if (match) {
            result.browser = {
                name: pattern.name,
                version: match[1] || match[2] || 'Unknown'
            };
            break;
        }
    }

    // Detect OS
    for (const pattern of osPatterns) {
        const match = userAgentString.match(pattern.regex);
        if (match) {
            result.os = {
                name: pattern.name,
                version: (match[1] || 'Unknown').replace(/_/g, '.')
            };
            break;
        }
    }

    // Detect device type
    for (const pattern of devicePatterns) {
        if (userAgentString.match(pattern.regex)) {
            result.device = pattern.name;
            break;
        }
    }

    return result;
}

/**
 * Check if the user agent indicates a mobile device
 * @param {string} userAgentString - The full user agent string
 * @returns {boolean} True if the user is on a mobile device
 */
export function isMobile(userAgentString) {
    return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentString);
}

/**
 * Get the user agent on the client side
 * @returns {string|null} The user agent string or null if not in browser
 */
export function getClientUserAgent() {
    if (typeof window !== 'undefined') {
        return navigator.userAgent;
    }
    return null;
}