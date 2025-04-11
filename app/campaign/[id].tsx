import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView, RefreshControl } from 'react-native';
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
import AmountModal from '@/components/Modal';
import { Card } from 'react-native-paper';
import Header from '@/components/Header';

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
  const [error, setError] = useState<string | null>(null);

  const { i18n } = useLanguage();
  const { accessToken } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { isRTL } = useLanguage();

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      await fetchCampaign(); // re-fetch the campaign data
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDonatePress = (campaignId: number) => {
    if (!accessToken) {
      router.push('/settings/login'); // Redirect if not logged in
    } else {
      setSelectedCampaignId(campaignId);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const response = await apiClient.get(`/campaign/${id}`);
      setError(null);
      setCampaign(response.data.campaign);
    } catch (err: any) {
      console.error("Error fetching campaign:", err.message);
      setError(err.message)
    } finally {
      setIsLoading(false);
    }
  };

  const imageUrl = campaign?.featured_image
    ? { uri: `${campaign?.featured_image}` }
    : require('@/assets/images/empty.jpg');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header title={''} />

      {/* Content */}
      {isLoading ? (
        <LoadingSingle />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[currentColors.calmBlue]}
              tintColor={currentColors.calmBlue}
            />
          }
        >
          {
            error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Card style={[styles.card, { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue }]}>
                <Card.Content>
                  <Image source={imageUrl} style={styles.image} />
                  <Text style={[styles.title, { color: currentColors.mainColor, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>{campaign?.title}</Text>
                  <Text style={[styles.description, { color: currentColors.mainColor, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>{campaign?.description}</Text>
                  <Text style={[styles.date, { color: currentColors.darkGrey, alignSelf: isRTL ? 'flex-start' : 'flex-end' }]}>
                    {i18n.t('availableTill')}: {campaign?.end_date}
                  </Text>
                  <View style={[styles.goalContainer, { backgroundColor: currentColors.mainColorWithOpacity, flexDirection: isRTL ? 'row-reverse' : 'row', }]}>
                    <Text style={[styles.goalLabel, { color: currentColors.darkGrey }]}>{i18n.t('goal')}:</Text>
                    <Text style={[styles.goalAmount, { color: currentColors.mainColor }]}>
                      {parseFloat(campaign?.goal_amount ?? '0')}$
                    </Text>
                  </View>
                  <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    <ProgressBar
                      percentage={campaign?.progress.percentage ?? 0}
                      raised={parseFloat(campaign?.progress.raised ?? '0')}
                      remaining={campaign?.progress.remaining ?? 0}
                      goal={parseFloat(campaign?.goal_amount ?? '0')}
                    />
                  </View>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={[styles.percentage, { color: currentColors.mainColor }]}>{i18n.t('collected')}: {campaign?.progress.raised}$</Text>
                    <Text style={[styles.percentage, { color: currentColors.mainColor }]}>{i18n.t('remaining')}: {campaign?.progress.remaining}$</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDonatePress(campaign?.id || 0)} style={[styles.donateButton, { backgroundColor: currentColors.button }]}>
                    <Text style={[styles.donateText, { color: currentColors.white }]}>{i18n.t('donateNow')}</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            )
          }

        </ScrollView>

      )}
      {selectedCampaignId !== null && (
        <AmountModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          accessToken={accessToken}
          campaignId={selectedCampaignId}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: width * 0.5,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 15,
  },
  card: {
    margin: 10,
    borderRadius: 15,
    padding: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
    alignSelf: 'flex-end'
  },
  goalContainer: {
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  donateButton: {
    alignSelf: 'center',
    padding: 15,
    //backgroundColor: '#4A5568',
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
  },
  donateText: {
    color: 'white',
    fontSize: 18,
  },
  percentage: {
    fontSize: 12,
    //marginTop: 5,
    margin: 5,
    fontWeight: "500",
    //color: "#A5B4FC",
    //marginHorizontal: 5
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center'
  },
});
