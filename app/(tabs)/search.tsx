import { Text, View, StyleSheet } from 'react-native';
 import { Link } from 'expo-router'; 
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';

export default function Search() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  
  return (
    <View style={[styles.container, {backgroundColor: currentColors.background}]}>
      <Text style={{color: currentColors.mainColor}}>Search screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
