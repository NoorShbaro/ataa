import { Text, View, StyleSheet } from 'react-native';
 import { Link, Stack } from 'expo-router'; 
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import Header from '@/components/Header';

export default function Notification() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n } = useLanguage();
  
  return (
    <View style={[styles.container, {backgroundColor: currentColors.background}]}>
        <Stack.Screen options={{ headerShown: false }} />
      
      <Header title={i18n.t('allowingNotification')} />

      <View style={styles.content}>
        <Text style={{ color: currentColors.mainColor }}>Notification screen</Text>
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
        justifyContent: 'flex-start',
      },
});
