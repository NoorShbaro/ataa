import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/constants/ThemeContext';
import { LanguageProvider } from '@/constants/LanguageContext';
import CustomSplashScreen from '@/components/SplashScreen';
import * as SplashScreen from 'expo-splash-screen';

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
        <ThemeProvider>
            <LanguageProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default RootLayout;
