import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useLanguage } from '@/constants/LanguageContext';
import apiClient from '@/constants/apiClient';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import ProgressBar from './ProgressBar';

type Category = {
    id: number;
    name: string;
};

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

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory !== null) {
            fetchCampaigns(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories/all');
            const categoryList = response.data.data; 
            setCategories(categoryList);
            //console.log(categories);

            if (categoryList.length > 0) {
                setSelectedCategory(categoryList[0].id); 
            }
        } catch (err: any) {
            console.log('Error fetching categories:', err.message);
        }
    };

    const fetchCampaigns = async (categoryId: number) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/campaigns/category/${categoryId}`);
            setCampaigns(response.data.campaigns);
        } catch (err: any) {
            console.log('Error fetching campaigns:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderCampaignItem = ({ item }: { item: Campaign }) => {
        const imageUrl = item.featured_image
            ? { uri: `https://be.donation.matrixvert.com/storage/${item.featured_image}` }
            : require('@/assets/images/empty.jpg');

        return (
            <View style={[styles.card, { backgroundColor: currentColors.mainColorWithOpacity }]}>
                <View style={{margin: 10, marginVertical: 10}}>
                <Image source={imageUrl} style={styles.image} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.campaignTitle, { color: currentColors.mainColor }]}>{item.title}</Text>
                <Text style={[styles.date, { color: currentColors.lightGrey }]}>{i18n.t('availableTill')}: {item.end_date}</Text>
                </View>
                
                <Text style={[styles.description, { color: currentColors.mainColor }]}>{item.description}</Text>

                

                {/* Progress Bar */}
                <ProgressBar 
                percentage={item.progress.percentage} 
                raised={parseFloat(item.progress.raised)} 
                remaining={item.progress.remaining} 
                goal={parseFloat(item.goal_amount)}/>
                </View>
                
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            {
                                backgroundColor: selectedCategory === category.id ? currentColors.mainColor : currentColors.lightGrey,
                            },
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Text style={[styles.categoryText, { color: currentColors.white }]}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCampaignItem}
                    contentContainerStyle={styles.listContainer}
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
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    description: {
        fontSize: 16,
        paddingLeft: 20,
        marginBottom: 10,
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
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
});

