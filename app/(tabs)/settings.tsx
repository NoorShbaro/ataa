import { Text, View, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Link, router } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useLanguage } from '@/constants/LanguageContext';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/constants/userContext';

export default function Settings() {

  const { isDarkMode, toggleTheme } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const { i18n } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [accessToken, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      setToken(storedToken); // Set token if available
      setRefreshToken(storedRefreshToken);
    };
    fetchTokens();
  }, []);

  return (
    <View style={[styles.mainContainer, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <ScrollView style={{ backgroundColor: currentColors.background }}>
        <View
          style={styles.container}>

          <TouchableOpacity
            onPress={() => (
              router.push(
                isAuthenticated ? '/settings/profile'
                  : '/settings/login'
              ))}
            style={[
              styles.itemBtn,
              { backgroundColor: currentColors.mainColorWithOpacity },
              { borderBottomColor: currentColors.background },
            ]}>
            <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
              {i18n.t('profile')}
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={currentColors.mainColor} />
          </TouchableOpacity>

          <Link href={`/settings/about`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
                {i18n.t('about')}
              </Text>
              <MaterialIcons name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/privacy`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText,
              { color: currentColors.mainColor }]}>
                {i18n.t('privacy')}
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/termofuse`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText,
              { color: currentColors.mainColor }]}>
                {i18n.t('termsOfUse')}
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/notifications`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
                {i18n.t('notification')}
              </Text>
              <MaterialIcons name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>

          <Link href={`/settings/language`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
                {i18n.t('languages')}
              </Text>
              <MaterialIcons name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.itemBtn,
            { backgroundColor: currentColors.mainColorWithOpacity },
            { borderBottomColor: currentColors.background, }
            ]}
            onPress={toggleTheme}>
            <Text style={[styles.itemBtnText,
            { color: currentColors.mainColor }]}>
              {i18n.t('darkMode')}
            </Text>
            <Switch
              thumbColor={currentColors.mainColor}
              onValueChange={toggleTheme}
              value={isDarkMode}
              style={{ transform: [{ scale: 0.8 }], marginBottom: -15, marginRight: -8 }}
            />

          </TouchableOpacity>


        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  itemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  itemBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
