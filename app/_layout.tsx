import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/constants/ThemeContext';
import { LanguageProvider } from '@/constants/LanguageContext';
import CustomSplashScreen from '@/components/SplashScreen';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from '@/constants/userContext';

//SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
    const [isSplashScreenVisible, setSplashScreenVisible] = useState(true);

    const handleSplashScreenFinish = async () => {
        setSplashScreenVisible(false);
        await SplashScreen.hideAsync();
    };

    if (isSplashScreenVisible) {
        return <CustomSplashScreen onFinish={handleSplashScreenFinish} />;
    }

    return (
        <UserProvider>
            <ThemeProvider>
                <LanguageProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </LanguageProvider>
            </ThemeProvider>
        </UserProvider>
    );
};

export default RootLayout;
