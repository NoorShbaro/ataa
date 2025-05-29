import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack, useNavigation } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import Header from '@/components/Header';

export default function DonationSuccessScreen() {
  const navigation = useNavigation();
  const animationRef = useRef(null);

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

  const { i18n } = useLanguage();

  const handleGoBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <LottieView
        source={require('@/assets/Lottie/Animation - 1743166826870.json')}
        autoPlay
        loop={false}
        style={{ width: 120, height: 120 }}
      />
      <Text style={[styles.successText, { color: currentColors.mainColor }]}>
        {i18n.t('donationReceived')}
      </Text>
      <Text style={styles.message}>
        {i18n.t('ngoWillContactSoon')}
      </Text>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  successText: { fontSize: 22, fontWeight: 'bold', marginTop: 16 },
  message: { fontSize: 16, textAlign: 'center', marginVertical: 20, color: '#777' },
  backButton: {
    backgroundColor: '#4A5568',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: { color: '#fff', fontSize: 16 },
});
