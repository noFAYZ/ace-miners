import { useCallback, useEffect, useState } from 'react';

const API_ENDPOINTS = {
    USER: (address) => `/api/user/${address}`,
    CLAIM_DATA: '/api/claim-data',
    CLAIM_DATA_BOOST: '/api/claim-data-boost',
    DROP_DATA: '/api/drop',
    TX_DATA: (address) => `/api/tx-data?address=${address}`,
};

const fetchWithErrorHandling = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
};

export const useWalletData = (address) => {
    // Initialize all state hooks first
    const [wallets, setWallets] = useState({
        ltcWallet: null,
        kdaWallet: null,
        ckbWallet: null
    });

    const [claimData, setClaimData] = useState([]);
    const [claimDataBoost, setClaimDataBoost] = useState([]);
    const [dropData, setDropData] = useState([]);
    const [txData, setTxData] = useState([]);

    const [loadingStates, setLoadingStates] = useState({
        wallets: false,
        claimData: false,
        claimDataBoost: false,
        dropData: false,
        txData: false
    });

    const [errors, setErrors] = useState({
        wallets: null,
        claimData: null,
        claimDataBoost: null,
        dropData: null,
        txData: null
    });

    // Define all functions using useCallback to prevent unnecessary re-renders
    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    }, []);

    const setError = useCallback((key, value) => {
        setErrors(prev => ({ ...prev, [key]: value }));
    }, []);

    const fetchWallets = useCallback(async () => {
        if (!address) return;

        setLoading('wallets', true);
        try {
            const data = await fetchWithErrorHandling(API_ENDPOINTS.USER(address));
            setWallets({
                ltcWallet: data.ltcWallet || null,
                kdaWallet: data.kdaWallet || null,
                ckbWallet: data.ckbWallet || null
            });
            setError('wallets', null);
        } catch (error) {
            setError('wallets', error.message);
        } finally {
            setLoading('wallets', false);
        }
    }, [address, setLoading, setError]);

    const fetchClaimData = useCallback(async () => {
        setLoading('claimData', true);
        try {
            const data = await fetchWithErrorHandling(API_ENDPOINTS.CLAIM_DATA);
            setClaimData(data);
            setError('claimData', null);
        } catch (error) {
            setError('claimData', error.message);
        } finally {
            setLoading('claimData', false);
        }
    }, [setLoading, setError]);

    const fetchClaimDataBoost = useCallback(async () => {
        setLoading('claimDataBoost', true);
        try {
            const data = await fetchWithErrorHandling(API_ENDPOINTS.CLAIM_DATA_BOOST);
            setClaimDataBoost(data);
            setError('claimDataBoost', null);
        } catch (error) {
            setError('claimDataBoost', error.message);
        } finally {
            setLoading('claimDataBoost', false);
        }
    }, [setLoading, setError]);

    const fetchDropData = useCallback(async () => {
        setLoading('dropData', true);
        try {
            const data = await fetchWithErrorHandling(API_ENDPOINTS.DROP_DATA);
            setDropData(data);
            setError('dropData', null);
        } catch (error) {
            setError('dropData', error.message);
        } finally {
            setLoading('dropData', false);
        }
    }, [setLoading, setError]);

    const fetchTxData = useCallback(async () => {
        if (!address) return;

        setLoading('txData', true);
        try {
            const data = await fetchWithErrorHandling(API_ENDPOINTS.TX_DATA(address));
            setTxData(data);
            setError('txData', null);
        } catch (error) {
            setError('txData', error.message);
        } finally {
            setLoading('txData', false);
        }
    }, [address, setLoading, setError]);

    const refreshAll = useCallback(async () => {
        await Promise.allSettled([
            fetchWallets(),
            fetchClaimData(),
            fetchClaimDataBoost(),
            fetchDropData(),
            fetchTxData()
        ]);
    }, [fetchWallets, fetchClaimData, fetchClaimDataBoost, fetchDropData, fetchTxData]);

    // Single useEffect hook for initial data fetch
    useEffect(() => {
        refreshAll();
    }, [refreshAll]); // Include refreshAll in dependencies

    // Calculate derived states
    const isLoading = Object.values(loadingStates).some(Boolean);
    const hasErrors = Object.values(errors).some(Boolean);

    // Return all values and functions
    return {
        // Data
        wallets,
        claimData,
        claimDataBoost,
        dropData,
        txData,

        // Loading states
        isLoading,
        loadingStates,

        // Errors
        errors,
        hasErrors,

        // Refresh functions
        refreshAll,
        refreshWallets: fetchWallets,
        refreshClaimData: fetchClaimData,
        refreshClaimDataBoost: fetchClaimDataBoost,
        refreshDropData: fetchDropData,
        refreshTxData: fetchTxData
    };
};