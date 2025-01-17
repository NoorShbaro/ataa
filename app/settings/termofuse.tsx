import { Text, View, StyleSheet } from 'react-native';
 import { Link, Stack } from 'expo-router'; 
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';

export default function TermOfUse() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  
  return (
    <View style={[styles.container, {backgroundColor: currentColors.background}]}>
        <Stack.Screen options={{ headerShown: false }} />
      
      <Header title="Terms of Use" />

      <View style={styles.content}>
        <Text style={{ color: currentColors.mainColor }}>TermOfUse screen</Text>
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
