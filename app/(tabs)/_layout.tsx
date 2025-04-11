import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import React from 'react';
import { StatusBar } from 'react-native';
import { useLanguage } from '@/constants/LanguageContext';

// Define types for tab icon props
type TabIconProps = {
  color: string;
  focused: boolean;
};

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n, isRTL } = useLanguage();

  // Define tabs in LTR order with proper typing
  const ltrTabs = [
    {
      name: "index",
      options: {
        title: `${i18n.t('home')}`,
        tabBarIcon: ({ color, focused }: TabIconProps) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }
    },
    {
      name: "campaigns",
      options: {
        title: `${i18n.t('camp')}`,
        tabBarIcon: ({ color, focused }: TabIconProps) => (
          <Ionicons name={focused ? 'pricetags' : 'pricetags-outline'} color={color} size={24} />
        ),
      }
    },
    {
      name: "mainDonation",
      options: {
        title: `${i18n.t('mainDonation')}`,
        tabBarIcon: ({ color, focused }: TabIconProps) => (
          <Ionicons name={focused ? 'heart' : 'heart-outline'} color={color} size={24} />
        ),
      }
    },
    {
      name: "settings",
      options: {
        title: `${i18n.t('settings')}`,
        tabBarIcon: ({ color, focused }: TabIconProps) => (
          <Ionicons name={focused ? 'cog' : 'cog-outline'} color={color} size={24} />
        ),
      }
    }
  ];

  // Reverse the array for RTL languages
  const tabs = isRTL ? [...ltrTabs].reverse() : ltrTabs;

  return (
    <>
      <StatusBar
        backgroundColor={currentColors.background}
        translucent={false}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: currentColors.calmBlue,
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerShadowVisible: false,
          headerTintColor: currentColors.mainColor,
          tabBarStyle: {
            backgroundColor: currentColors.background,
            height: 70,
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          tabBarLabelPosition: 'below-icon',
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={tab.options}
          />
        ))}
      </Tabs>
    </>
  );
}