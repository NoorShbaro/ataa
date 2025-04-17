import { createContext, useState, useEffect, useContext } from 'react';
import { I18nManager, Platform, NativeModules, Alert, AppState } from 'react-native'; // Added missing imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';
import * as Updates from 'expo-updates';
import * as Localization from 'expo-localization';
import en from '@/locale/en/translation.json';
import ar from '@/locale/ar/translation.json';

const LanguageContext = createContext();

// Translations
const translations = { en, ar };
const i18n = new I18n(translations);
i18n.enableFallback = true;

const LANGUAGE_KEY = 'app_language';
const RTL_KEY = 'app_rtl';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const [isRTL, setIsRTL] = useState(false); // <-- now dynamic

  // 1. Enhanced RTL application with retries
  const applyRTL = async (rtlValue) => {
    try {
      setIsRTL(rtlValue);
      console.log('Applying RTL:', rtlValue);
    } catch (error) {
      console.error('Error applying RTL:', error);
      setIsRTL(false);
    }
  };

  // 2. Load language and apply RTL on initial load
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const storedRTL = await AsyncStorage.getItem(RTL_KEY);

        const lang = storedLanguage || 'en';
        const rtl = storedRTL !== null ? JSON.parse(storedRTL) : lang === 'ar';

        i18n.locale = lang;
        setLanguage(lang);
        await applyRTL(rtl);
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();
  }, []);

  // 3. Re-apply RTL when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const rtl = language === 'ar';
        await applyRTL(rtl);
      }
    });

    return () => subscription.remove();
  }, [language]);

  const changeLanguage = async (lang) => {
    try {
      console.log('Changing Language to:', lang); // Add this log
      const rtl = lang === 'ar';
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      await AsyncStorage.setItem(RTL_KEY, JSON.stringify(rtl));

      i18n.locale = lang;
      setLanguage(lang);
      await applyRTL(rtl);

      if (Platform.OS === 'android') {
        setTimeout(() => {
          Updates.reloadAsync();
        }, 100);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, i18n, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};