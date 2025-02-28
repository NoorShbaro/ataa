import { Text, View, StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';

export default function Index() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const {i18n} = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={{ color: currentColors.mainColor }}> 
      {i18n.t('home')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
