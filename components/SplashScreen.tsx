import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';

type CustomSplashScreenProps = {
  onFinish: () => void;
};

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
    const { isDarkMode } = useTheme();
      const currentColors = isDarkMode ? DarkColors : LightColors;
      
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      // Simulate some asynchronous work like loading assets
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        if (onFinish) {
          onFinish();
        }
      }, 3000); // Adjust the delay as needed
    };

    prepare();
  }, []);

  return (
    <View style={[styles.container,{backgroundColor: currentColors.button}]}>
      <Text style={[styles.text,{color: currentColors.lightGrey}]}>ATAA DONATION APP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CustomSplashScreen;
