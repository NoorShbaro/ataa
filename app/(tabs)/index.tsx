import { Text, View, StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import MainHeader from '@/components/MainHeader';
import Campaign from '@/components/Slider';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/constants/userContext';
import apiClient from '@/constants/apiClient';

type Campaigns = {
  id: number;
  title: string;
  body: string;
  description: string;
  goal_amount: string;

  created_at: string;

  ngo: {
    id: number,
    name: string,
  }
};

export default function Index() {

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const [campaign, setCampaign] = useState<Campaigns[]>([]);

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
      console.log(campaign);

    } catch (err: any) {
      console.log("Error:", err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <MainHeader />
      <View style={[styles.view, { backgroundColor: currentColors.background }]}>
        <Campaign campaigns={campaign} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
