import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type MainHeaderProps = {
    //title: string;
  };

const MainHeader = (/*{ title }: MainHeaderProps*/) => {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  return (
    <SafeAreaView
      edges={['top']}
      style={[{ backgroundColor: currentColors.background }]}
    >
      <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10
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
    </SafeAreaView>
  );
};

export default MainHeader;

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
    fontSize: 24,
    fontWeight: '600',
  },
});
