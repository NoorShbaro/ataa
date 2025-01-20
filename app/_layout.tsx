import { Stack } from 'expo-router';
import { ThemeProvider } from '@/constants/ThemeContext';
import { LanguageProvider } from '@/constants/LanguageContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </LanguageProvider>
    </ThemeProvider>
  );
}
