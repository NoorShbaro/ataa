import { Text, View, StyleSheet, Dimensions } from 'react-native';
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

  useEffect(() => {
    fetchCampaign();
  }, []);


  const fetchCampaign = async () => {
    try {
      //if (!accessToken) throw new Error('Authentication token not found.');

      const response = await apiClient.get("/campaigns/all", {});

      const result = await response.data.campaigns;
      setCampaign(result);
      setLoading(false);
      console.log(campaign);

    } catch (err: any) {
      console.log("Error:", err.message);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <View style={[{
        backgroundColor: currentColors.background, 
        position: 'relative',
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30
      }]}>
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
                height: 150,
              }}
            />
            <MotiView
              from={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, type: 'timing', duration: 1000 }}
              style={{
                width: 30,
                backgroundColor: currentColors.skeletonBase,
                alignSelf: 'center',
                marginBottom: 10,
                paddingHorizontal: 16,
                //paddingVertical: 20,
                borderRadius: 8,
                height: 8,
              }}
            />
          </View>
        ) : (
          <Campaign campaigns={campaign} />
        )}

      </View>
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
    height: 150,
    borderRadius: 15,

  }
});
