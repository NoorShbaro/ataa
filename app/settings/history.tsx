import { Text, View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import Header from '@/components/Header';
import apiClient from '@/constants/apiClient';
import { useEffect, useState } from 'react';
import { useAuth } from '@/constants/userContext';
import LoadingHistory from '@/components/LoadingHistory';

interface History {
  id: number;
  campaign_name: string;
  amount: string;
  status: string;
  donated_at: string;
}

export default function Notification() {
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n, isRTL } = useLanguage();

  const [history, setHistory] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get("/donor/donations", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setHistory(response.data.donations);
    } catch (err: any) {
      console.error("Error fetching History:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: History }) => (
    <View style={[styles.card, { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue }]}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', }}>
        <Text style={[styles.campaignText, { color: currentColors.mainColor }]}>{item.campaign_name}</Text>
        <Text style={[styles.date, { color: currentColors.darkGrey }]}>{item.donated_at}</Text>
      </View>

      <Text style={[styles.amountText, { color: currentColors.button, textAlign: isRTL ? 'right' : 'left' }]}>${item.amount}</Text>
      <Text style={[styles.status, { color: item.status === 'pending' ? currentColors.mustard : currentColors.green, textAlign: isRTL ? 'right' : 'left' }]}>
        {item.status}
      </Text>

      {item.status === 'pending' && (
        <Text style={[styles.note, { color: currentColors.darkGrey, marginTop: 5, textAlign: isRTL ? 'right' : 'left' }]}>
          {i18n.t('contact')}
        </Text>
      )}

    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={i18n.t('history')} />

      {isLoading ? (
        <LoadingHistory />
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: currentColors.mainColor }]}>{i18n.t('noDonationsYet')}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[currentColors.calmBlue]} // Android
              tintColor={currentColors.calmBlue} // iOS
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    //shadowOffset: { width: 0, height: 1 },
    //shadowOpacity: 0.1,
    //shadowRadius: 6,
    //elevation: 3,
  },
  campaignText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    marginRight: 10
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
  },

});
