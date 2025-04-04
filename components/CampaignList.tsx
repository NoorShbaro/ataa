import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import apiClient from '@/constants/apiClient';
import { router } from 'expo-router';
import { MotiView } from 'moti';

type Category = {
    id: number;
    name: string;
};

type Campaign = {
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
    categories?: Category[];
};

export default function CampaignList() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await apiClient.get('/campaigns/all');
            const result: Campaign[] = response.data.campaigns;
            setCampaigns(result);

            // Auto-select the first campaign and its first category (if any)
            if (result.length > 0) {
                setSelectedCampaign(result[0]);
                if (result[0].categories && result[0].categories.length > 0) {
                    setSelectedCategory(result[0].categories[0]);
                }
            }
        } catch (err: any) {
            console.log('Error:', err.message);
        } finally {
            setLoading(false)
        }
    };

    const handleCampaignSelect = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        if (campaign.categories && campaign.categories.length > 0) {
            setSelectedCategory(campaign.categories[0]); // Auto-select first category if available
        } else {
            setSelectedCategory(null);
        }
    };

    const filteredCategories = selectedCampaign?.categories
        ? [selectedCampaign.categories] // If the campaign has a category, use it
        : [];

    const filteredCampaigns = campaigns.filter((campaign) =>
        selectedCampaign ? campaign.id === selectedCampaign.id : true
    );


    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {campaigns.map((campaign) => (
                    <TouchableOpacity
                        key={campaign.id}
                        style={[
                            styles.campaignItem,
                            {
                                backgroundColor: selectedCampaign?.id === campaign.id ? currentColors.mainColor : currentColors.cardBackground,
                            },
                        ]}
                        onPress={() => handleCampaignSelect(campaign)}
                    >
                        <Text
                            style={[
                                styles.campaignText,
                                { color: selectedCampaign?.id === campaign.id ? currentColors.white : currentColors.mainColor },
                            ]}
                        >
                            {campaign.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Categories (if available) */}
            {selectedCampaign?.categories && selectedCampaign.categories.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                    {selectedCampaign.categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryItem,
                                {
                                    backgroundColor: selectedCategory?.id === category.id ? currentColors.mainColor : currentColors.cardBackground,
                                },
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    { color: selectedCategory?.id === category.id ? currentColors.white : currentColors.mainColor },
                                ]}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Display Data Based on Selection */}
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
                <Text style={[styles.noCampaignText, { color: currentColors.mainColor }]}>No campaigns available.</Text>
            ) : (
                <FlatList
                    data={filteredCampaigns} // Show only the selected campaign
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const imageUrl = item.featured_image
                            ? { uri: `https://be.donation.matrixvert.com/storage/${item.featured_image}` }
                            : require('@/assets/images/empty.jpg');

                        return (
                            <TouchableOpacity onPress={() => router.push(`/campaign/${item.id}`)}>
                                <View style={[styles.card, { backgroundColor: currentColors.mainColorWithOpacity, borderColor: currentColors.button, flexDirection: 'row', padding: 10 }]}>
                                    {/* Image */}
                                    <Image source={imageUrl} style={styles.image} />

                                    {/* Campaign Details */}
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 10 }}>
                                        <View>
                                            <Text style={[styles.campaignTitle, { color: currentColors.mainColor }]}>{item.title}</Text>
                                            <Text style={[styles.description, { color: currentColors.mainColor }]}>{item.description}</Text>
                                        </View>

                                        {/* Date at Bottom Right */}
                                        <Text style={[styles.date, { color: currentColors.mainColorWithOpacity, alignSelf: 'flex-end' }]}>
                                            {item.end_date}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    scrollView: {
        marginBottom: 10,
    },
    campaignItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    campaignText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
    },
    selectedInfo: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 10,
        //padding: 15,
        marginBottom: 15,
        width: '100%',
        //borderWidth: 1
        //shadowColor: '#000',
        //shadowOpacity: 0.1,
        //shadowOffset: { width: 0, height: 2 },
        //shadowRadius: 4,
        //elevation: 3,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
        resizeMode: 'cover',
        //marginBottom: 10,
        alignSelf: 'center'
    },
    campaignTitle: {
        fontSize: 18,
        //paddingLeft: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        paddingLeft: 10,
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        fontWeight: '500',
        //marginBottom: 15,
        alignSelf: 'flex-end',
        //marginHorizontal: 10,
        //marginTop:  55,
        //left: 30
        bottom: 0
    },
    noCampaignText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

