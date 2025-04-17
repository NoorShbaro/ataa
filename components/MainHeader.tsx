import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/constants/userContext';
import { useLanguage } from '@/constants/LanguageContext';

const MainHeader = () => {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();

  const insets = useSafeAreaInsets();

  // Prevent rendering until insets are available (especially important on iOS)
  if (!insets) return null;

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: currentColors.background }}
    >
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 10, // add some bottom spacing too just in case
        }}
      >
        <Image
          source={
            isDarkMode
              ? require('@/assets/images/ATAAD.png')
              : require('@/assets/images/ATAAL.png')
          }
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            borderRadius: 30,
            bottom: 5,
          }}
        />

        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            gap: 15,
          }}
        >
          <TouchableOpacity>
            <Ionicons name="notifications" size={30} color={currentColors.calmBlue} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(isAuthenticated ? '/settings/profile' : '/settings/login')
            }
          >
            <Ionicons name="person-circle" size={35} color={currentColors.calmBlue} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainHeader;
