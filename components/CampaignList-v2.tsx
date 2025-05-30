import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, RefreshControl } from 'react-native';
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

export default function CampaignList_v2() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const { isRTL } = useLanguage();
    const scrollViewRef = useRef<ScrollView>(null);
    const reversedCategories = isRTL ? [...categories].reverse() : categories;

    const handleRefreshAll = async () => {
        setIsRefreshing(true);
        await fetchCategories();
        await fetchCampaigns(selectedCategory || 0);
        setIsRefreshing(false);
    };


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
        } finally {
            setLoading(false)
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
        const imageSource = item.featured_image
            ? { uri: item.featured_image }
            : require('@/assets/images/empty.jpg');

        const flexDir = 'row';
        const textAlign = 'left';

        return (
            <TouchableOpacity onPress={() => router.push(`/campaign/${item.id}`)}>
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
        <View style={[styles.container, {
            backgroundColor: currentColors.background,
            marginBottom: 70
        }]}>
            {loading ? (
                <>
                    <View style={{
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        justifyContent: isRTL ? 'flex-end' : 'flex-start'
                    }}>
                        <MotiView style={[styles.skeleton, {
                            backgroundColor: currentColors.skeletonBase,
                        }]} />
                        <MotiView style={[styles.skeleton, {
                            marginHorizontal: 10,
                            backgroundColor: currentColors.skeletonBase
                        }]} />
                    </View>
                    <MotiView style={[styles.skeletonLarge, {
                        backgroundColor: currentColors.skeletonBase,
                    }]} />
                    <MotiView style={[styles.skeletonLarge, {
                        backgroundColor: currentColors.skeletonBase,
                    }]} />
                    <MotiView style={[styles.skeletonLarge, {
                        backgroundColor: currentColors.skeletonBase,
                    }]} />
                </>
            ) : (
                <FlatList
                    data={campaigns}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCampaignItem}
                    contentContainerStyle={[
                        styles.listContainer,
                        isRTL && { direction: 'rtl' }
                    ]}
                    refreshing={isRefreshing}
                    onRefresh={handleRefreshAll}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefreshAll}
                            colors={[currentColors.calmBlue]}
                            tintColor={currentColors.calmBlue}
                        />
                    }
                    ListHeaderComponent={() => (
                        <>
                            {categories.length === 0 ? (
                                <Text style={[styles.noCampaignText, {
                                    color: currentColors.mainColor,
                                }]}>
                                    {i18n.t('noCategory')}
                                </Text>
                            ) : (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.scrollView}
                                    contentContainerStyle={{
                                        //flexDirection: isRTL ? 'row-reverse' : 'row',
                                        justifyContent: 'flex-start'
                                    }}
                                    ref={scrollViewRef}

                                >
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryButton,
                                                {
                                                    backgroundColor: selectedCategory === category.id
                                                        ? currentColors.button
                                                        : currentColors.cardBackground,
                                                    marginEnd: isRTL ? 0 : 10,
                                                    marginStart: isRTL ? 10 : 0
                                                },
                                            ]}
                                            onPress={() => setSelectedCategory(category.id)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryText,
                                                    {
                                                        color: selectedCategory === category.id
                                                            ? currentColors.white
                                                            : currentColors.darkGrey,
                                                        textAlign: isRTL ? 'right' : 'left',
                                                        writingDirection: isRTL ? 'rtl' : 'ltr'
                                                    },
                                                ]}
                                            >
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </>
                    )}
                    ListEmptyComponent={() =>
                        !loading && (
                            <Text style={[styles.noCampaignText, {
                                color: currentColors.mainColor,

                            }]}>
                                {i18n.t('noCampaign')}
                            </Text>
                        )
                    }
                />)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
    scrollView: {
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    skeleton: {
        width: '25%',
        alignSelf: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 10,
        height: 20,
    },
    skeletonLarge: {
        width: '100%',
        alignSelf: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 10,
        height: 100,
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
        // marginBottom: 15,
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
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5
    },
    listContainer: {
        paddingBottom: 20,
    },
    percentage: {
        fontSize: 12,
        //marginTop: 5,
        margin: 5,
        fontWeight: "500",
        //color: "#A5B4FC",
        //marginHorizontal: 5
    },
});

