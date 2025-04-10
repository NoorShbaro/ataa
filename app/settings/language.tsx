import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import Header from '@/components/Header';
import { MaterialIcons } from '@expo/vector-icons';

export default function Language() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const { language, changeLanguage, i18n } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header title={i18n.t('selectLanguage')} />

      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue },
            { borderBottomColor: currentColors.background },
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
            {i18n.t('en')}
          </Text>
          {language === 'en' && (
            <MaterialIcons
              name="check"
              size={25}
              color={currentColors.mainColor}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue },
            { borderBottomColor: currentColors.background },
          ]}
          onPress={() => changeLanguage('ar')}
        >
          <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
            {i18n.t('ar')}
          </Text>
          {language === 'ar' && (
            <MaterialIcons
              name="check"
              size={25}
              color={currentColors.mainColor}
            />
          )}
        </TouchableOpacity>
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
    padding: 16,
    paddingVertical: 100,
  },
  itemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    borderRadius: 15,
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
