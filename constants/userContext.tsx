import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

type AuthContextType = {
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    error: string;
    isChecked: boolean; // Add this if needed
    toggleCheckbox: () => void; // Add this if needed
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        const loadTokens = async () => {
            const storedAccessToken = await SecureStore.getItemAsync('accessToken');
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                //refreshAccessToken();
            }
        };
        loadTokens();
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            alert('Please Fill All Fields');
            return;
        }
        setError('');

        try {
            const response = await axios.post('https://be.donation.matrixvert.com/api/donor/login', { email, password });
            const data = response.data;
            const accessToken = data.access_token.access_token;
            const refreshToken = data.refresh_token;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            router.replace('/settings/profile');
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid email or password.');
        }
    };

    const signup = async (fullName: string, email: string, password: string) => {
        if (!fullName || !email || !password) {
            alert('Please Fill All Fields');
            return;
        }

        if (!isChecked) {
            alert('Please Agree To Terms');
            return;
        }

        setError('');

        try {
            const response = await axios.post('https://be.donation.matrixvert.com/api/donor/register', { fullName, email, password });
            const data = response.data;
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            router.replace('/settings/profile');
        } catch (error) {
            console.error('Signup failed', error);
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
                                await axios.post('http://be.donation.matrixvert.com/api/donor/logout', {}, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });
                            } catch (error) {
                                console.error('Logout API call failed', error);
                            }
                        }

                        await SecureStore.deleteItemAsync('accessToken');
                        await SecureStore.deleteItemAsync('refreshToken');
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
        if (accessToken) {
            try {
                await axios.post('http://be.donation.matrixvert.com/api/donor/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } catch (error) {
                console.error('Logout API call failed', error);
            }
        }

        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);

    };

    const refreshAccessToken = async () => {
        try {
            console.log('Checking stored refresh token...');

            const response = await axios.post('http://be.donation.matrixvert.com/api/donor/refresh', {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            });
            const newAccessToken = response.data.access_token.access_token;
            const newRefreshToken = response.data.refresh_token;
            const expiresIn = response.data.access_token.expires_in;

            console.log('Response status:', response.status);

            if (typeof newAccessToken !== 'string' || typeof newRefreshToken !== 'string') {
                throw new Error('Tokens are not valid strings');
            }

            await SecureStore.setItemAsync('accessToken', newAccessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            console.log('Token refreshed successfully! New access token:', newAccessToken);
            if (newRefreshToken) {
                console.log('New refresh token received and saved.');
            } else {
                console.log('No new refresh token received, keeping the old one.');
            }

            const refreshInterval = (expiresIn - 10) * 1000; // Refresh 10 seconds before expiry
            setTimeout(() => {
                refreshAccessToken();
            }, refreshInterval);

        } catch (error) {
            console.error('Failed to refresh token', error);
            refreshLogout();
        }
    };

    useEffect(() => {
        if (accessToken) {
            // Start the token refresh process when the accessToken is set
            refreshAccessToken();
        }
    }, [accessToken]);

    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, signup, logout, isAuthenticated, error, isChecked, toggleCheckbox }}>
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
