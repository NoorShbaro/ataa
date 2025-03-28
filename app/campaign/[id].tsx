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
import AmountModal from '@/components/Modal';
import { Card } from 'react-native-paper';

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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);


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
  
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </TouchableOpacity>
  
        {/* Content */}
        {isLoading ? (
          <LoadingSingle />
        ) : (
          <>
            <Image source={imageUrl} style={styles.image} />
            <Card style={[styles.card, {backgroundColor: currentColors.mainColorWithOpacity}]}>
              <Card.Content>
                <Text style={[styles.title, { color: currentColors.mainColor }]}>{campaign?.title}</Text>
                <Text style={[styles.description, { color: currentColors.mainColor }]}>{campaign?.description}</Text>
                <Text style={[styles.date, { color: currentColors.mainColor }]}>
                  {i18n.t('availableTill')}: {campaign?.end_date}
                </Text>
                <View style={[styles.goalContainer, { backgroundColor: currentColors.mainColorWithOpacity }]}>
                  <Text style={[styles.goalLabel, { color: currentColors.darkGrey }]}>{i18n.t('goal')}:</Text>
                  <Text style={[styles.goalAmount, { color: currentColors.mainColor }]}>
                    {parseFloat(campaign?.goal_amount ?? '0')}$
                  </Text>
                </View>
                <ProgressBar
                  percentage={campaign?.progress.percentage ?? 0}
                  raised={parseFloat(campaign?.progress.raised ?? '0')}
                  remaining={campaign?.progress.remaining ?? 0}
                  goal={parseFloat(campaign?.goal_amount ?? '0')}
                />
                <TouchableOpacity onPress={() => handleDonatePress(campaign?.id || 0)} style={[styles.donateButton, {backgroundColor: currentColors.button}]}>
                  <Text style={[styles.donateText,{color: currentColors.background}]}>{i18n.t('donateNow')}</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
            {selectedCampaignId !== null && (
              <AmountModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                accessToken={accessToken}
                campaignId={selectedCampaignId}
              />
            )}
          </>
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
    height: width * 0.6,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 8,
    borderRadius: 20,
  },
  card: {
    margin: 10,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  goalContainer: {
    flexDirection: 'row',
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
});
