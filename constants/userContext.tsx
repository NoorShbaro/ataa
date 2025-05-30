import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import axios from 'axios';

const TOKEN_REFRESH_INTERVAL = 60 * 1000;

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    error: string;
    resetError: () => void;
    isChecked: boolean; // Add this if needed
    toggleCheckbox: () => void; // Add this if needed
    cooldown : number;
    canSubmit: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const resetError = () => setError("");
    const [isChecked, setIsChecked] = useState(false);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    //const isRefreshingRef = useRef(false);

    const [cooldown, setCooldown] = useState(0);   // seconds left
    const cooldownSeconds = 60;                   // one-minute lockout

    const canSubmit = cooldown === 0;

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        loadTokens();
        const appStateListener = AppState.addEventListener("change", handleAppStateChange);
        const interval = setInterval(checkAuth, TOKEN_REFRESH_INTERVAL);

        return () => {
            appStateListener.remove();
            clearInterval(interval); // Cleanup when component unmounts
        };
    }, []);

    const loadTokens = async () => {
        const storedAccessToken = await SecureStore.getItemAsync('accessToken');
        const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        if (storedAccessToken) {
            checkAuth();
        }
    };

    const checkAuth = async () => {
        const storedAccessToken = await SecureStore.getItemAsync('accessToken');
        if (!storedAccessToken) return;

        try {
            await apiClient.get("/donor/me", {
                headers: { Authorization: `Bearer ${storedAccessToken}` },
            });
        } catch (error: any) {
            if (error.response?.status === 401) {
                refreshAccessToken();
            }
        }
    };

    const refreshAccessToken = async () => {
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!storedRefreshToken) {
            refreshLogout();
            return;
        }
        try {
            const response = await apiClient.post(
                "/donor/refresh",
                {},
                {
                    headers: { Authorization: `Bearer ${storedRefreshToken}` },
                }
            );
            const newAccessToken = response.data.access_token.access_token;
            const newRefreshToken = response.data.refresh_token;
            await SecureStore.setItemAsync('accessToken', newAccessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            console.log('Token refreshed successfully!');
        } catch (error: any) {
            refreshLogout();
        }
    };

    const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === "active") {
            checkAuth();
        }
    };

    /*useEffect(() => {
        const loadTokens = async () => {
            const storedAccessToken = await SecureStore.getItemAsync('accessToken');
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
            const storedExpiresIn = await AsyncStorage.getItem('expires_in');
            if (storedAccessToken && storedRefreshToken && storedExpiresIn) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setRefreshTimeout(parseInt(storedExpiresIn));
                //setRefreshTimeout();
                //refreshAccessToken();
            }
        };
        loadTokens();
    }, []);*/

    /*const setRefreshTimeout = (expiresIn: number) => {
        if (!expiresIn || expiresIn <= 0) return; // Prevent invalid timeouts

        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        refreshTimeoutRef.current = setTimeout(() => {
            //console.log(`Refreshing token in ${expiresIn} seconds...`);
            refreshAccessToken();
        }, (expiresIn - 10) * 1000); // Refresh 10 seconds before expiry
    };*/

    const startCooldown = () => setCooldown(cooldownSeconds);

    useEffect(() => {
        if (cooldown === 0) return;
        const id = setInterval(() => setCooldown(c => c - 1), 1000);
        return () => clearInterval(id);
    }, [cooldown]);


    const login = async (email: string, password: string) => {
        if (!email || !password) {
            alert('Please Fill All Fields');
            return;
        }
        setError('');

        try {
            const response = await apiClient.post("/donor/login", { email, password });
            const data = response.data;
            const accessToken = data.access_token.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.access_token.expires_in;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('expires_in', JSON.stringify(expiresIn)); // Store as a string

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            //setRefreshTimeout(expiresIn);

            router.replace('/success/ProfileSuccessScreen');
        } catch (error) {
            console.error('Login failed', error);
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                setError(`Too many attempts. Try again in ${cooldownSeconds}s.`);
                startCooldown();                         // kick off the timer
            } else {
                setError('Invalid email or password.');
            }
        }
    };

    const signup = async (name: string, email: string, password: string) => {


        setError('');

        try {
            const response = await apiClient.post('/donor/register', { name, email, password });
            const data = response.data;
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;
            const expiresIn = data.expires_in;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('expires_in', JSON.stringify(expiresIn)); // Store as a string

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            //setRefreshTimeout(expiresIn);

            router.replace('/success/ProfileSuccessScreen');
        } catch (error) {
            console.error('Signup failed', error);
            console.log(name, email, password);

            setError('Invalid email.');
        }
    };

    const logout = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        if (accessToken) {
                            try {
                                await apiClient.post("/donor/logout", {}, {
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                });
                            } catch (error) {
                                console.error('Logout API call failed', error);
                            }
                        }

                        if (refreshTimeoutRef.current) {
                            clearTimeout(refreshTimeoutRef.current);
                            refreshTimeoutRef.current = null;
                        }

                        await SecureStore.deleteItemAsync('accessToken');
                        await SecureStore.deleteItemAsync('refreshToken');
                        await AsyncStorage.removeItem('expires_in');
                        setAccessToken(null);
                        setRefreshToken(null);

                        router.replace('/settings/login');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const refreshLogout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await AsyncStorage.removeItem('expires_in');
        setAccessToken(null);
        setRefreshToken(null);
    };

    /*const refreshAccessToken = async () => {
        if (accessToken){
            try {
                //console.log('Checking stored refresh token...');
    
                if (isRefreshingRef.current) {
                    console.log('Refresh already in progress, skipping...');
                    return;
                }
                isRefreshingRef.current = true;
    
                const response = await apiClient.post('/donor/refresh', {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });
                const newAccessToken = response.data.access_token.access_token;
                const newRefreshToken = response.data.refresh_token;
                const expiresIn = response.data.access_token.expires_in;
    
                //console.log('Response status:', response.status);
    
                if (typeof newAccessToken !== 'string' || typeof newRefreshToken !== 'string') {
                    throw new Error('Tokens are not valid strings');
                }
    
                await SecureStore.setItemAsync('accessToken', newAccessToken);
                await SecureStore.setItemAsync('refreshToken', newRefreshToken);
                await AsyncStorage.setItem('expires_in', JSON.stringify(expiresIn)); // Store as a string
    
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
    
                console.log('Token refreshed successfully!');
    
                setRefreshTimeout(expiresIn);
    
            } catch (error) {
                console.error('Failed to refresh token', error);
                refreshLogout();
            } finally {
                isRefreshingRef.current = false;
            }
        } else {
            console.log('not logged in');         
        }
        

    };*/

    /*useEffect(() => {
        if (accessToken && refreshToken) {
            // Retrieve the expiry time stored when logging in or refreshing
            AsyncStorage.getItem('expires_in').then((expiresIn) => {
                if (expiresIn) {
                    setRefreshTimeout(parseInt(expiresIn)); // Convert string to number
                }
            });
        }
    }, [accessToken, refreshToken]);*/



    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, signup, logout, isAuthenticated, error, resetError, isChecked, toggleCheckbox, cooldown, canSubmit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider');
    }
    return context;
};
