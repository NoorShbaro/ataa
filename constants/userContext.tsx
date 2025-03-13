import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
    logout: () => void;
    refreshTokenHandler: () => void;
    login: (email: string, password: string) => Promise<void>;
    error: string;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const checkTokenValidity = async () => {
            const expired = await isTokenExpired();
            if (expired) {
                await refreshTokenHandler();
            }
        };

        const interval = setInterval(checkTokenValidity, 10 * 1000); // Check every 30 seconds
        checkTokenValidity(); // Run immediately on mount

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


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
                        try {
                            const token = await SecureStore.getItemAsync('userToken');
                            if (!token) {
                                console.log('No token found');
                                return;
                            }

                            const response = await fetch('http://be.donation.matrixvert.com/api/donor/logout', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                            });

                            if (response.ok) {
                                // Remove token from storage
                                await SecureStore.deleteItemAsync('userToken');
                                await SecureStore.deleteItemAsync('refreshToken');
                                await AsyncStorage.removeItem('tokenExpiry');
                                await AsyncStorage.setItem('isLoggedIn', 'false');
                                setIsLoggedIn(false);
                                router.replace('/settings/login');
                            } else {
                                console.log('Logout failed');
                            }
                        } catch (error) {
                            console.log('Error during logout:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const refreshLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await AsyncStorage.removeItem('tokenExpiry');
            await AsyncStorage.setItem('isLoggedIn', 'false');
            setIsLoggedIn(false);
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    const saveToken = async (accessToken: string, refreshToken: string, expiresIn: number): Promise<void> => {
        try {
            const expiryTimestamp = Date.now() + expiresIn;
            await SecureStore.setItemAsync('userToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('tokenExpiry', expiryTimestamp.toString());
        } catch (error) {
            console.error('Failed to save token:', error);
        }
    };

    const isTokenExpired = async (): Promise<boolean> => {
        try {
            const expiryTimestamp = await AsyncStorage.getItem('tokenExpiry');
            return !expiryTimestamp || Date.now() > Number(expiryTimestamp);
        } catch (error) {
            console.error('Failed to check token expiration:', error);
            return true;
        }
    };

    const refreshTokenHandler = async (): Promise<void> => {
        try {
            console.log('Checking stored refresh token...');
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

            if (!storedRefreshToken) {
                console.log('No valid refresh token found');
                await refreshLogout();
                return;
            }

            console.log('Stored refresh token found:', storedRefreshToken);
            console.log('Attempting token refresh request...');

            const response = await fetch('http://be.donation.matrixvert.com/api/donor/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedRefreshToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.log('Refresh token expired or invalid, deleting data...');
                await refreshLogout();
                return;
            }

            const data = await response.json();
            console.log('Refresh token response:', data);

            if (!data.access_token) {
                console.log('No access token received, deleting data...');
                await refreshLogout();
                return;
            }

            await saveToken(data.access_token.access_token, data.refresh_token, data.expires_in);

            console.log('Token refreshed successfully! New access token:', data.access_token);
            if (data.refresh_token) {
                console.log('New refresh token received and saved.');
            } else {
                console.log('No new refresh token received, keeping the old one.');
            }

        } catch (error) {
            console.error('Error refreshing token:', error);
            await refreshLogout();
        }
    };


    const login = async (email: string, password: string) => {
        if (!email || !password) {
            alert('Please fill all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://be.donation.matrixvert.com/api/donor/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');

            await saveToken(data.access_token.access_token, data.refresh_token, data.expires_in);
            setIsLoggedIn(true);
            await AsyncStorage.setItem('isLoggedIn', 'true');
            router.replace('/settings/profile');
        } catch (error) {
            console.error('Login error:', error);
            setIsLoggedIn(false);
            await AsyncStorage.setItem('isLoggedIn', 'false');
            setError('Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ logout, login, error, refreshTokenHandler }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
