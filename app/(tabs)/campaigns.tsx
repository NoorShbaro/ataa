import { Text, View, StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import MainHeader from '@/components/MainHeader';
import CampaignList from '@/components/CampaignList';

export default function Campaigns() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const { i18n } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <CampaignList />
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
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
