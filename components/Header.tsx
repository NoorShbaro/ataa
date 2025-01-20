import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type HeaderProps = {
    title: string;
  };

const Header = ({ title }: HeaderProps) => {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  return (
    <SafeAreaView
      edges={['top']}
      style={[{ backgroundColor: currentColors.background }]}
    >
      <View style={[styles.container, { backgroundColor: currentColors.background }]}>
        {/* Back Icon */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color={currentColors.mainColor}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.title, { color: currentColors.mainColor }]}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 60, 
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
