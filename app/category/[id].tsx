import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import apiClient from '@/constants/apiClient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import ProgressBar from '@/components/ProgressBar';
import Header from '@/components/Header';

type Campaign = {
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

export default function CampaignList() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            fetchCampaigns();
    }, []);
    

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/campaigns/category/${id}`);
            setCampaigns(response.data.campaigns);
        } catch (err: any) {
            console.log('Error fetching campaigns:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderCampaignItem = ({ item }: { item: Campaign }) => {
        const imageUrl = item.featured_image
            ? { uri: `${item.featured_image}` }
            : require('@/assets/images/empty.jpg');

        return (
            <TouchableOpacity onPress={() => router.push(`/campaign/${item.id}`)} style={{ marginHorizontal: 10 }}>
                <View style={[styles.card, { backgroundColor: currentColors.cardBackground }]}>
                    <View style={{ margin: 10, marginVertical: 10 }}>
                        <Image source={imageUrl} style={styles.image} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.campaignTitle, { color: currentColors.mainColor }]}>{item.title}</Text>
                            <Text style={[styles.date, { color: currentColors.mainColorWithOpacity }]}>{i18n.t('availableTill')}: {item.end_date}</Text>
                        </View>

                        

                        {/* Progress Bar */}
                        <ProgressBar
                            percentage={item.progress.percentage}
                            raised={parseFloat(item.progress.raised)}
                            remaining={item.progress.remaining}
                            goal={parseFloat(item.goal_amount)} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.percentage, { color: currentColors.mainColor }]}>{i18n.t('collected')}: {item.progress.raised}$</Text>
                            <Text style={[styles.percentage, { color: currentColors.mainColor }]}>{i18n.t('remaining')}: {item.progress.remaining}$</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
              <Stack.Screen options={{ headerShown: false }} />
        
              <Header title={''} />
        

            {/* Display Data Based on Selection */}
            {loading ? (
                <View style={{marginHorizontal: 10}}>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                        style={{
                            width: '100%',
                            backgroundColor: currentColors.skeletonBase,
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 20,
                            borderRadius: 10,
                            height: 300,
                        }}
                    />
                </View>
            ) : campaigns.length === 0 ? (
                <Text style={[styles.noCampaignText, { color: currentColors.mainColor }]}>No campaigns available.</Text>
            ) : (
                <FlatList
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCampaignItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderRadius: 10,
        marginBottom: 15,
        width: '100%',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    campaignTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 10
    },
    date: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'flex-end',
        bottom: 0,
        margin: 10,
    },
    noCampaignText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    percentage: {
        fontSize: 12,
        margin: 5,
        fontWeight: "500",
    },
});

