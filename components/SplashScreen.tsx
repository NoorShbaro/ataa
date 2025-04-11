import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("window");

type CustomSplashScreenProps = {
  onFinish: () => void;
};

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500, // Fade-out duration
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1500); // How long to show the splash before fade-out

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor: currentColors.background, opacity }]}>
      <LottieView
        source={require('@/assets/Lottie/Animation - 1740739459878.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/ATAAD.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  animation: {
    height: height + 100,
    width: width + 100,
    resizeMode: 'cover',
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 30,
    height: 200,
  }
});

export default CustomSplashScreen;
