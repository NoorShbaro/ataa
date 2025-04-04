import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import React from 'react';
import { StatusBar, TouchableOpacity, Image, View } from 'react-native';
import { useLanguage } from '@/constants/LanguageContext';


export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const {i18n} = useLanguage();

  const CustomHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
      }}
    >
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: 50, height: 50, resizeMode: 'contain', borderRadius: 30 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        {/* Notification Icon */}
        <TouchableOpacity>
          <Ionicons name="notifications" size={30} color={currentColors.mainColor} />
        </TouchableOpacity>

        {/* Profile Icon */}
        <TouchableOpacity>
          <Ionicons name="person-circle" size={35} color={currentColors.mainColor} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        backgroundColor={currentColors.background}
        translucent={false}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: currentColors.mainColor,
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
            paddingBottom:10,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: `${i18n.t('home')}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="campaigns"
          options={{
            title: `${i18n.t('camp')}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'pricetags' : 'pricetags-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="mainDonation"
          options={{
            title: `${i18n.t('mainDonation')}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart' : 'heart-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: `${i18n.t('settings')}`,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'cog' : 'cog-outline'} color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
