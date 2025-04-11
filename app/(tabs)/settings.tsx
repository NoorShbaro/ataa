import { Text, View, StyleSheet, Modal, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
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

  const { i18n, isRTL } = useLanguage();
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
              { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
              { borderBottomColor: currentColors.background },
            ]}>
            <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
              {i18n.t('profile')}
            </Text>
            <MaterialIcons name= {isRTL?"arrow-back-ios":"arrow-forward-ios" } size={16} color={currentColors.mainColor} />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => router.push('/settings/about')}
            style={[styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
            { borderBottomColor: currentColors.background, }
            ]}>
            <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
              {i18n.t('about')}
            </Text>
            <MaterialIcons name= {isRTL?"arrow-back-ios":"arrow-forward-ios" }
              size={16}
              color={currentColors.mainColor}
            />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => router.push('/settings/privacy')} style={[styles.itemBtn,
          { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
          { borderBottomColor: currentColors.background, }
          ]}>
            <Text style={[styles.itemBtnText,
            { color: currentColors.mainColor }]}>
              {i18n.t('privacy')}
            </Text>
            <MaterialIcons
               name= {isRTL?"arrow-back-ios":"arrow-forward-ios" }
              size={16}
              color={currentColors.mainColor}
            />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => router.push('/settings/termofuse')}
            style={[styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
            { borderBottomColor: currentColors.background, }
            ]}>
            <Text style={[styles.itemBtnText,
            { color: currentColors.mainColor }]}>
              {i18n.t('termsOfUse')}
            </Text>
            <MaterialIcons
               name= {isRTL?"arrow-back-ios":"arrow-forward-ios" }
              size={16}
              color={currentColors.mainColor}
            />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => (
            router.push(
              isAuthenticated ? '/settings/history'
                : '/settings/login'
            ))}
            style={[styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
            { borderBottomColor: currentColors.background, }
            ]}
          >
            <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
              {i18n.t('history')}
            </Text>
            <MaterialIcons  name= {isRTL?"arrow-back-ios":"arrow-forward-ios" }
              size={16}
              color={currentColors.mainColor}
            />
          </TouchableOpacity>


          <TouchableOpacity style={[styles.itemBtn,
          { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flexDirection: isRTL ? 'row-reverse' : 'row', },
          { borderBottomColor: currentColors.background, }
          ]} onPress={() => router.push('/settings/language')}>
            <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>
              {i18n.t('languages')}
            </Text>
            <MaterialIcons  name= {isRTL?"arrow-back-ios":"arrow-forward-ios" }
              size={16}
              color={currentColors.mainColor}
            />
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.itemBtn,
            { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue, flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row', },
            { borderBottomColor: currentColors.background, }
            ]}
            onPress={toggleTheme}>
            <Text style={[styles.itemBtnText,
            { color: currentColors.mainColor }]}>
              {i18n.t('darkMode')}
            </Text>
            <Switch
              thumbColor={currentColors.calmBlue}
              onValueChange={toggleTheme}
              value={isDarkMode}
              style={{ transform: [{ scale: 0.8 }], marginVertical: -12, marginRight: -8 }}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 8,
    borderRadius: 15
  },
  itemBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
