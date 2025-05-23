import { Text, View, StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import MainHeader from '@/components/MainHeader';

export default function MainDonation() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const { i18n } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <View style={[styles.view, { backgroundColor: currentColors.background }]}>
        <Text style={[styles.text, {
          color: currentColors.mainColor,
        }]}>
          {i18n.t('mainDonation')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 20,
    marginTop: 20,
  }
});
