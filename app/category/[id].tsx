import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView, RefreshControl } from 'react-native';
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
    const { i18n, isRTL } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onRefresh = async () => {
        setIsRefreshing(true);
        setLoading(true);
        try {
            await fetchCampaigns(); // re-fetch the campaign data
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);


    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/campaigns/category/${id}`);
            setError(null);
            setCampaigns(response.data.campaigns);
        } catch (err: any) {
            console.log('Error fetching campaigns:', err.message);
            setError(err.message)
        } finally {
            setLoading(false);
        }
    };

    const renderCampaignItem = ({ item }: { item: Campaign }) => {
        const imageSource = item.featured_image
            ? { uri: item.featured_image }
            : require('@/assets/images/empty.jpg');

        const flexDir = 'row';
        const textAlign = 'left';

        return (
            <TouchableOpacity onPress={() => router.push(`/campaign/${item.id}`)} style={{ paddingHorizontal: 20, }}>
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: currentColors.cardBackground,
                            shadowColor: currentColors.calmBlue,
                        },
                    ]}
                >
                    {/* row container */}
                    <View style={{ flexDirection: flexDir, alignItems: 'center', padding: 12 }}>
                        {/* thumbnail */}
                        <Image
                            source={imageSource}
                            style={[
                                styles.thumb,
                                {
                                    marginLeft: isRTL ? 0 : 10,
                                    marginRight: isRTL ? 10 : 0
                                },
                            ]}
                        />

                        {/* text + progress */}
                        <View style={{ flex: 1, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.title,
                                    { color: currentColors.mainColor, textAlign },
                                ]}
                            >
                                {item.title}
                            </Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.by, { color: currentColors.darkGrey, marginLeft: isRTL ? 0 : 15, marginRight: isRTL ? 15 : 0 }]}>
                                    {i18n.t('by')}:
                                </Text>
                                <Text style={[styles.ngo, { color: currentColors.calmBlue, marginLeft: isRTL ? 0 : 5, marginRight: isRTL ? 5 : 0 }]}>
                                    {item?.ngo || 'Unknown'}
                                </Text>
                            </View>

                            {/* progress bar */}
                            <ProgressBar
                                percentage={item.progress.percentage}
                                raised={parseFloat(item.progress.raised)}
                                remaining={item.progress.remaining}
                                goal={parseFloat(item.goal_amount)}
                            />
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

            {loading ? (
                <View style={{ marginHorizontal: 10 }}>
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
                            height: 100,
                        }}
                    />
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
                            height: 100,
                        }}
                    />
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
                            height: 100,
                        }}
                    />
                </View>
            ) : (
                <FlatList
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCampaignItem}
                    contentContainerStyle={[
                        styles.listContainer,
                        isRTL && { direction: 'rtl' },
                        { flexGrow: 1 }
                    ]}
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
                    ListEmptyComponent={() => (
                        error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : (
                            <Text style={[styles.noCampaignText, { color: currentColors.mainColor }]}>
                                {i18n.t('noCampaign')}
                            </Text>
                        )
                    )}
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
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
    },
    thumb: {
        width: 150,
        height: 100,
        borderRadius: 6,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ngo: {
        fontSize: 16,
        marginBottom: 6,
    },
    // card: {
    //     borderRadius: 10,
    //     marginBottom: 15,
    //     width: '100%',
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 5,
    //     elevation: 5,
    // },
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
        //alignSelf: 'flex-end',
        bottom: 0,
        margin: 0,
        top: 5,
        marginHorizontal: 15,
        marginTop: 10
    },
    ngoName: {
        marginTop: 0,
        marginHorizontal: 15,
        //alignSelf: 'flex-end',
        top: 3,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: '700',
        //marginTop: 4,
        // marginHorizontal: 15,
    },
    by: {
        fontSize: 14,
        fontWeight: '500',
        //marginTop: 4,
        marginBottom: 6,
    },
    noCampaignText: {
        alignSelf: 'center',
        fontWeight: '600',
        letterSpacing: 0.5,
        fontSize: 20,
        marginTop: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    percentage: {
        fontSize: 12,
        margin: 5,
        fontWeight: "500",
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
        alignSelf: 'center'
    },
    retryText: {

    },
    retryButton: {

    }
});

