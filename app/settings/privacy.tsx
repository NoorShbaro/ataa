import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import Header from '@/components/Header';

export default function Privacy() {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header title={i18n.t('privacy')} />

      <View style={styles.content}>
        <Text style={{ color: currentColors.mainColor }}>Privacy screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
