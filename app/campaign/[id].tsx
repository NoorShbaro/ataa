import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/constants/userContext';
import { useEffect, useState } from 'react';
import apiClient from '@/constants/apiClient';
import ProgressBar from '@/components/ProgressBar';
import { MotiView } from 'moti';
import LoadingSingle from '@/components/SingleLoading';

type Campaigns = {
  id: number;
  title: string;
  description: string;
  goal_amount: string;
  start_date: string;
  end_date: string;
  featured_image: string;
  category: string;
  ngo: string;
  progress: {
    raised: string;
    percentage: number;
    remaining: number;
  }
};

const { width } = Dimensions.get('screen');

export default function Donate() {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaigns | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { i18n } = useLanguage();
  const { accessToken } = useAuth();

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const response = await apiClient.get(`/campaign/${id}`);
      setCampaign(response.data.campaign);
    } catch (err: any) {
      console.error("Error fetching campaign:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const imageUrl = campaign?.featured_image
    ? { uri: `https://be.donation.matrixvert.com/storage/${campaign?.featured_image}` }
    : require('@/assets/images/empty.jpg');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Full Width Image */}
      <Image source={imageUrl} style={styles.image} />

      {/* Back Button Overlay */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
      </TouchableOpacity>

      {/* Content Below Image */}
      {isLoading ? (
        <LoadingSingle />
      ) : (
        <View style={styles.content}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.title, { color: currentColors.mainColor }]}>{campaign?.title}</Text>
            <Text style={{ color: currentColors.mainColor, marginTop: 50, marginLeft: 25 }}>{i18n.t('availableTill')}: {campaign?.end_date}</Text>
          </View>
          <View style={[styles.contentWrapper, { backgroundColor: currentColors.mainColorWithOpacity }]}>
            <Text style={[styles.goalLabel, { color: currentColors.darkGrey }]}>
              {i18n.t('goal')}:
            </Text>
            <Text style={[styles.goalAmount, { color: currentColors.mainColor }]}>
              {parseFloat(campaign?.goal_amount ?? "0")}$
            </Text>
          </View>
          <ProgressBar
            percentage={campaign?.progress.percentage ?? 0}
            raised={parseFloat(campaign?.progress.raised ?? "0")}
            remaining={campaign?.progress.remaining ?? 0}
            goal={parseFloat(campaign?.goal_amount ?? "0")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: width, // Keep aspect ratio for a header-like appearance
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    position: 'absolute',
    width: 35,
    height: 40,
    top: 50, // Adjusted for safe area
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    marginTop: width, 
    paddingHorizontal: 20,
    //alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    //textAlign: 'center',
    marginBottom: 100,
    //marginTop: 25,
    margin: 25,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    margin: 10,
    //marginTop: 100
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10
  },
  contentWrapper: {
    flexDirection: 'row',
    borderRadius: 15,
    width: 120
  }
});
