import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Stack, useNavigation } from 'expo-router';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

export default function DonationSuccessScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n } = useLanguage();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Fullscreen background animation */}
      <LottieView
        source={require('@/assets/Lottie/Animation - 1748588256537.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />

      {/* Foreground content */}
      <View style={[styles.content, { backgroundColor: 'transparent' }]}>
        <FontAwesome name="check-circle" size={70} color={currentColors.green} style={styles.checkIcon} />

        <Text style={[styles.successText, { color: currentColors.mainColor }]}>
          {i18n.t('donationReceived')}
        </Text>
        <Text style={[styles.message, { color: currentColors.darkGrey }]}>
          {i18n.t('ngoWillContactSoon')}
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: currentColors.button }]}
          onPress={handleGoBack}
        >
          <Text style={[styles.backButtonText, { color: currentColors.white }]}>{i18n.t('goBack')}</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    padding: 20,
  },
  animation: {
    height: height + 100,
    width: width + 100,
    resizeMode: 'cover',
    position: 'absolute',
  },
  checkIcon: {
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  backButtonText: {
    // color: '#fff',
    fontSize: 16,
  },
});
