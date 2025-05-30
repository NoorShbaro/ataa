import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView, RefreshControl, Alert } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/constants/userContext';
import { useEffect, useState } from 'react';
import apiClient from '@/constants/apiClient';
import ProgressBar from '@/components/ProgressBar';
import { MotiView } from 'moti';
import LoadingSingle from '@/components/SingleLoading';
import AmountModal from '@/components/Modal';
import { Card } from 'react-native-paper';
import Header from '@/components/Header';
import PaymentMethodBottomSheet from '@/components/PaymentMethodBottomSheet';

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
  //const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);

  const handleSelect = (method: 'cash' | 'credit') => {
    setVisible(false);
    Alert.alert('Selected Method', method.toUpperCase());
  };

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
      //setModalVisible(true);
      setVisible(true)
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
              <>
                {/* 1️⃣  Hero image – flush to the top */}
                <View style={{ position: 'relative' }}>
                  {/* 🔙 Back button */}
                  <TouchableOpacity
                    onPress={() => router.back()}       // or router.back()
                    style={{
                      position: 'absolute',
                      top: 40,                                // drop a bit below the status bar
                      left: isRTL ? undefined : 16,
                      right: isRTL ? 16 : undefined,
                      zIndex: 10,
                      backgroundColor: currentColors.cardBackground + 'AA', // translucent circle
                      borderRadius: 20,
                      padding: 6,
                    }}
                  >
                    <Ionicons
                      name={isRTL ? 'arrow-forward' : 'arrow-back'}
                      size={24}
                      color={currentColors.mainColor}
                    />
                  </TouchableOpacity>

                  {/* 1️⃣ Hero image – flush to the top */}
                  <Image source={imageUrl} style={[styles.image, { margin: 0 }]} />
                </View>
                {/* <Header title={''} /> */}
                <Card style={[styles.card, { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue }]}>
                  <Card.Content>
                    {/* 2️⃣  Title */}
                    <Text
                      style={[
                        styles.title,
                        { color: currentColors.mainColor, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {campaign?.title}
                    </Text>

                    {/* 3️⃣  “by” NGO name + Till date (single row) */}
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <Text style={[styles.by, { color: currentColors.darkGrey, alignSelf: isRTL ? 'flex-start' : 'flex-end', marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
                          {i18n.t('by')}:
                        </Text>
                        <Text style={[styles.ngoName, { color: currentColors.calmBlue, alignSelf: isRTL ? 'flex-start' : 'flex-end', marginLeft: isRTL ? 0 : 5, marginRight: isRTL ? 5 : 0 }]}>
                          {campaign?.ngo || 'Unknown'}
                        </Text>
                      </View>

                      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <Text style={[styles.by, { color: currentColors.darkGrey, alignSelf: isRTL ? 'flex-start' : 'flex-end', marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
                          {i18n.t('till')}:
                        </Text>
                        <Text style={[styles.till, { color: currentColors.darkGrey, alignSelf: isRTL ? 'flex-start' : 'flex-end', marginLeft: isRTL ? 0 : 5, marginRight: isRTL ? 5 : 0 }]}>
                          {campaign?.end_date}
                        </Text>
                      </View>
                    </View>

                    {/* 4️⃣  Raised / Goal  */}

                    <View
                      style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        justifyContent: 'space-evenly',
                        // marginVertical: 5,

                      }}
                    >
                      {/* <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: "space-between" }}> */}
                      <Text style={[styles.raised, {
                        color: currentColors.darkGrey,
                        // alignSelf: isRTL ? 'flex-start' : 'flex-end',
                        //  marginLeft: isRTL ? 0 : 15, 
                        //  marginRight: isRTL ? 15 : 0 
                      }]}>
                        ${campaign?.progress.raised}
                      </Text>
                      <Text style={[styles.fund, {
                        color: currentColors.darkGrey,
                        // alignSelf: isRTL ? 'flex-start' : 'flex-end', 
                        // marginLeft: isRTL ? 0 : 5, 
                        // marginRight: isRTL ? 5 : 0
                      }]}>
                        {i18n.t('fundRaisedFrom')}
                      </Text>
                      <Text style={[styles.raised, { color: currentColors.darkGrey }]}>
                        ${campaign?.goal_amount}
                      </Text>
                      {/* </View> */}


                    </View>

                    {/* 5️⃣  Progress bar */}
                    <View style={{ margin: 10, direction: isRTL ? 'rtl' : 'ltr' }}>
                      <ProgressBar
                        percentage={campaign?.progress.percentage ?? 0}
                        raised={parseFloat(campaign?.progress.raised ?? '0')}
                        remaining={campaign?.progress.remaining ?? 0}
                        goal={parseFloat(campaign?.goal_amount ?? '0')}
                      />
                    </View>

                    {/* 6️⃣  Donate button */}
                    <TouchableOpacity
                      onPress={() => handleDonatePress(campaign?.id || 0)}
                      style={[styles.donateButton, { backgroundColor: currentColors.button }]}
                    >
                      <Text style={[styles.donateText, { color: currentColors.white }]}>
                        {i18n.t('donateNow')}
                      </Text>
                    </TouchableOpacity>

                    {/* 7️⃣  Description */}
                    <Text
                      style={[
                        styles.des,
                        { color: currentColors.mainColor, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {i18n.t('description')}
                    </Text>
                    <Text
                      style={[
                        styles.description,
                        { color: currentColors.mainColor, textAlign: isRTL ? 'right' : 'left' },
                      ]}
                    >
                      {campaign?.description}
                    </Text>
                  </Card.Content>
                </Card>
              </>

            )
          }

        </ScrollView>

      )}
      {selectedCampaignId !== null && (
        <PaymentMethodBottomSheet
          isVisible={visible}
          onClose={() => setVisible(false)}
          campaignId={selectedCampaignId}
          accessToken={accessToken}
          onSuccess={() => console.log('Donation Completed')}
        />
      )}

    </SafeAreaView>
  );
}

{/** 
        <AmountModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          accessToken={accessToken}
          campaignId={selectedCampaignId}
        /> 
        <PaymentMethodBottomSheet
          isVisible={visible}
          onClose={() => setVisible(false)}
          onSelect={handleSelect}
        />*/}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 400,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  des: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  ngo: {
    fontSize: 16,
    marginTop: 2,
  },
  raised: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
    // marginHorizontal: 15,
    marginBottom: 5,
  },
  till: {
    fontSize: 14,
    marginTop: 10
  },
  donateButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    marginTop: 14,
    lineHeight: 22,
  },
  // image: {
  //   width: '100%',
  //   height: width * 0.5,
  //   resizeMode: 'cover',
  //   alignSelf: 'center',
  //   marginBottom: 20,
  //   borderRadius: 15,
  // },
  card: {
    margin: 10,
    borderRadius: 15,
    padding: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  // title: {
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  // description: {
  //   fontSize: 16,
  //   marginBottom: 10,
  //   marginLeft: 10
  // },
  date: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
    alignSelf: 'flex-end'
  },
  ngoName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    // marginHorizontal: 15,
    // marginBottom: 5,
  },
  by: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    // marginBottom: 5,
  },
  fund: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    // marginBottom: 5,
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
  // donateButton: {
  //   alignSelf: 'center',
  //   padding: 15,
  //   //backgroundColor: '#4A5568',
  //   borderRadius: 10,
  //   width: '60%',
  //   alignItems: 'center',
  // },
  // donateText: {
  //   color: 'white',
  //   fontSize: 18,
  // },
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
