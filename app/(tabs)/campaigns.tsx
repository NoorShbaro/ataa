import { Text, View, StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import MainHeader from '@/components/MainHeader';
import CampaignList_v2 from '@/components/CampaignList-v2';

export default function Campaigns() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const { i18n } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <CampaignList_v2 />
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
