import { createContext, useState, useEffect, useContext } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from '@/locale/en/translation.json';
import ar from '@/locale/ar/translation.json';

const LanguageContext = createContext();

// Translations
const translations = { en, ar };
const i18n = new I18n(translations);
const deviceLocales = Localization.getLocales();
i18n.locale = deviceLocales[0]?.languageCode || 'en';
i18n.enableFallback = true;

const LANGUAGE_KEY = 'app_language';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load stored language on app load
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      const lang = storedLanguage || deviceLocales[0]?.languageCode || 'en';
      const rtl = lang === 'ar';

      setLanguage(lang);
      setIsRTL(rtl);
      i18n.locale = lang;

      // Force RTL layout if needed
      if (I18nManager.isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        // You might need to restart your app here for changes to take effect
        // Alternatively, you can reload the app's main component
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    const rtl = lang === 'ar';

    setLanguage(lang);
    setIsRTL(rtl);
    i18n.locale = lang;
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);

    // Force RTL layout if needed
    if (I18nManager.isRTL !== rtl) {
      I18nManager.forceRTL(rtl);
      // You might need to restart your app here for changes to take effect
      // Alternatively, you can reload the app's main component
    }
  };

  const RTLWrapper = ({ children }) => {
    const { isRTL } = useLanguage();

    useEffect(() => {
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        // Note: Some layout changes might still require a restart
      }
    }, [isRTL]);

    return children;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, i18n, isRTL }}>
      <RTLWrapper>
        {children}
      </RTLWrapper>
    </LanguageContext.Provider>
  );
};