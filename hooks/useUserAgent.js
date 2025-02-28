import { useEffect, useState } from 'react';
import { getClientUserAgent, isMobile, parseUserAgent } from '../helper/userAgent';

/**
 * Custom hook to get and parse user agent information on the client side
 * @param {string} initialUserAgent - Optional user agent string from server side
 * @returns {object} User agent information
 */
export default function useUserAgent(initialUserAgent = null) {
    const [userAgentData, setUserAgentData] = useState({
        userAgent: initialUserAgent,
        parsed: initialUserAgent ? parseUserAgent(initialUserAgent) : null,
        isMobile: initialUserAgent ? isMobile(initialUserAgent) : false,
        isLoading: !initialUserAgent,
    });

    useEffect(() => {
        // Skip if we already have data from server or if not in browser
        if (userAgentData.parsed || typeof window === 'undefined') {
            return;
        }

        // Get client-side user agent
        const clientUserAgent = getClientUserAgent();

        if (clientUserAgent) {
            setUserAgentData({
                userAgent: clientUserAgent,
                parsed: parseUserAgent(clientUserAgent),
                isMobile: isMobile(clientUserAgent),
                isLoading: false,
            });
        } else {
            setUserAgentData(prev => ({ ...prev, isLoading: false }));
        }
    }, [userAgentData.parsed]);

    return userAgentData;
}