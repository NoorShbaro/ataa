import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';
import en from '@/locale/en/translation.json';
import ar from '@/locale/ar/translation.json';

const LanguageContext = createContext();

// Translations
const translations = { en, ar };
const i18n = new I18n(translations);
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

  useEffect(() => {
    // Load stored language on app load
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        setLanguage(storedLanguage);
        i18n.locale = storedLanguage;
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    i18n.locale = lang;
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};
