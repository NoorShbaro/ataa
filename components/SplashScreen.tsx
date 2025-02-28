import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
      
    useEffect(() => {
        // Simulate loading time, then call onFinish
        const timeout = setTimeout(() => {
            onFinish();
        }, 1500); // Adjust the delay as needed

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: currentColors.button }]}>
            <LottieView
                source={require('@/assets/Lottie/Animation - 1740739459878.json')}
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        height: height,
        width: width,
        resizeMode: 'contain'
    },
});

export default CustomSplashScreen;
