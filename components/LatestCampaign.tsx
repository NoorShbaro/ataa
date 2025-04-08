import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import apiClient from '@/constants/apiClient';
import ProgressBar from './ProgressBar';
import { MotiView } from 'moti';
import { router } from 'expo-router';

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
    progress: {
        raised: string;
        percentage: number;
        remaining: number;
    }
};

export default function LatestCampaign() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();

    const [campaigns, setCampaigns] = useState<Campaigns[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await apiClient.get('/campaigns/all');
            const result = response.data.campaigns;
            setCampaigns(result);
            //console.log(campaigns);

        } catch (err: any) {
            console.log('Error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Campaigns }) => {
        const imageUrl = item.featured_image
            ? { uri: `${item.featured_image}` }
            : require('@/assets/images/empty.jpg');

        //const percentage = Math.min(100, Math.round((item.amount_raised / item.goal_amount) * 100));
        //const remaining = item.goal_amount - item.amount_raised;

        return (
            <TouchableOpacity onPress={() => router.push(`/campaign/${item.id}`)} style={{marginBottom: 50}}>
                <View style={[styles.card, { backgroundColor: currentColors.cardBackground, borderColor: currentColors.button }]}>
                    <Image source={imageUrl} style={styles.image} />
                    <Text style={[styles.campaignTitle, { color: currentColors.mainColor }]}>{item.title}</Text>
                    
                    <Text style={[styles.date, { color: currentColors.mainColorWithOpacity }]}>
                        {item.end_date}
                    </Text>
                    {/* Progress Bar */}
                    <View style={{marginHorizontal: 10}}>
                    <ProgressBar
                            percentage={item.progress.percentage}
                            raised={parseFloat(item.progress.raised)}
                            remaining={item.progress.remaining}
                            goal={parseFloat(item.goal_amount)} />
                </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>


            {loading ? (
                <>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                        style={{
                            width: '45%',
                            backgroundColor: currentColors.skeletonBase,
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 20,
                            borderRadius: 10,
                            height: 40,
                        }}
                    />
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                        style={{
                            width: 200,
                            backgroundColor: currentColors.skeletonBase,
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 20,
                            borderRadius: 10,
                            height: 250,
                        }}
                    />
                </>
            ) : campaigns.length === 0 ? (
                <Text style={[styles.noCampaignText, { color: currentColors.mainColor }]}>{i18n.t('noCampaign')}</Text>
            ) : (
                <>
                    <Text style={[styles.title, { color: currentColors.mainColor }]}>{i18n.t('latestCampaign')}</Text>
                    <FlatList
                        data={campaigns}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
    },
    loadingText: {
        fontSize: 16,
    },
    card: {
        borderRadius: 10,
        //padding: 15,
        marginBottom: 15,
        marginRight: 10,
        width: 200,
        //borderWidth: 1
        //shadowColor: '#000',
        //shadowOpacity: 0.1,
        //shadowOffset: { width: 0, height: 2 },
        //shadowRadius: 4,
        //elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'center'
    },
    description: {
        fontSize: 16,
        paddingLeft: 15,
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        paddingRight: 15,
        fontWeight: '500',
        marginBottom: 15,
        alignSelf: 'flex-end'
    },
    campaignTitle: {
        fontSize: 16,
        paddingLeft: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noCampaignText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

