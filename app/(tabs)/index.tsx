import { Text, View, StyleSheet, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import MainHeader from '@/components/MainHeader';
import Campaign from '@/components/Slider';
import React, { useEffect, useState } from 'react';
import { MotiView } from 'moti';
import axios from 'axios';
import { useAuth } from '@/constants/userContext';
import apiClient from '@/constants/apiClient';
import LatestCampaign from '@/components/LatestCampaign';
import Categories from '@/components/Category';
import LoadingIndex from '@/components/IndexLoading';

const { width } = Dimensions.get('screen');

type Campaigns = {
  id: number;
  ngo_id: number;
  title: string;
  description: string;
  goal_amount: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  featured_image: string;
  category_id: number;
  ngo: {
    id: number;
    name: string;
  }
  category: {
    id: number;
    name: string;
  }
};

export default function Index() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const [campaign, setCampaign] = useState<Campaigns[]>([]);
  const [loading, setLoading] = useState(true);

  const { i18n } = useLanguage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      setTimeout(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };


  const fetchCampaign = async () => {
    try {
      //if (!accessToken) throw new Error('Authentication token not found.');

      const response = await apiClient.get("/campaigns/all", {});

      const result = await response.data.campaigns;
      setCampaign(result);
      setLoading(false);
      //console.log(campaign);

    } catch (err: any) {
      console.log("Error:", err.message);
      setLoading(false);
    }
  };

  if (!campaign.length) {
    return (<View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      {
        isLoading ? (
          <LoadingIndex />
        ) : (
          <ScrollView style={[{
            backgroundColor: currentColors.background,
          }]}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[currentColors.calmBlue]}
                tintColor={currentColors.calmBlue}
              />
            } >
            <Text style={[styles.noCampaigns, { color: currentColors.mainColor, }]}>{i18n.t('noCampaign')}</Text>
          </ScrollView>
        )
      }
    </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      {
        isLoading ? (
          <LoadingIndex />
        ) : (
          <ScrollView style={[{
            backgroundColor: currentColors.background,
          }]}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[currentColors.calmBlue]}
                tintColor={currentColors.calmBlue}
              />
            } >
            {loading ? (
              <View style={styles.view}>
                <MotiView
                  from={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ loop: true, type: 'timing', duration: 1000 }}
                  style={{
                    width: '100%',
                    backgroundColor: currentColors.skeletonBase,
                    alignSelf: 'center',
                    marginBottom: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 20,
                    borderRadius: 10,
                    height: 200,
                  }}
                />
              </View>
            ) : (
              <Campaign campaigns={campaign} />
            )}
            <View style={{ marginVertical: 10 }}>
              <Categories />
            </View>
            <LatestCampaign />

          </ScrollView>
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    //alignItems: 'center',
    //justifyContent: 'center',
    width: width - 60,
    height: 200,
    borderRadius: 15,
    //top: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 30,
    marginBottom: 30
  },
  noCampaigns: {
    alignSelf: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontSize: 20,
    marginTop: 20,
  }
});
