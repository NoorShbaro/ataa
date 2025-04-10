import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import axios from 'axios';
import { useTheme } from '@/constants/ThemeContext';
import { Colors, DarkColors, LightColors } from "@/constants/Colors";
import { router } from 'expo-router';
import apiClient from '@/constants/apiClient';
import { MotiView } from 'moti';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguage } from '@/constants/LanguageContext';

type Category = {
    id: number;
    name: string;
    icon: string
};

const Categories = () => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<(React.ElementRef<typeof TouchableOpacity> | null)[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories/all');
            const result = response.data.data;
            setCategories(result);
            //console.log(categories);

        } catch (err: any) {
            console.log('Error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <View style={styles.loading}>
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: "timing", duration: 1000 }}
                            style={{
                                width: 100,
                                backgroundColor: currentColors.skeletonBase,
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 8,
                                height: 70,
                            }}
                        />
                    </View>
                    <View style={styles.loading}>
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: "timing", duration: 1000 }}
                            style={{
                                width: 100,
                                backgroundColor: currentColors.skeletonBase,
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 8,
                                height: 70,
                            }}
                        />
                    </View>
                    <View style={styles.loading}>
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: "timing", duration: 1000 }}
                            style={{
                                width: 100,
                                backgroundColor: currentColors.skeletonBase,
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 8,
                                height: 70,
                            }}
                        />
                    </View>
                </View>
            ) : categories.length > 0 ? (
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsWrapper}
                >
                    {categories.map((category, index) => {
                        const imageUrl = category?.icon
                            ? { uri: `https://be.donation.matrixvert.com/storage/${category.icon}` }
                            : null;

                        return (
                            <TouchableOpacity
                                key={category.id}
                                ref={(el) => (itemRef.current[index] = el)}
                                style={[styles.item, { backgroundColor: currentColors.cardBackground, shadowColor: currentColors.calmBlue }]}
                                onPress={() => router.push(`/category/${category.id}`)}
                            >
                                <View style={styles.categoryContainer}>
                                    {imageUrl ? (
                                        <Image source={imageUrl} style={styles.icon} />
                                    ) : (
                                        <FontAwesome name="folder" size={24} color={currentColors.mainColor} />
                                    )}
                                    <Text style={[styles.itemText, { color: currentColors.mainColor }]}>
                                        {category.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                        );
                    })}
                </ScrollView>
            ) : categories.length === 0 ? (
                <Text style={[styles.noCategoryText, { color: currentColors.mainColor }]}>
                    {i18n.t('noCategory')}
                </Text>
            ) : (
                <Text style={[styles.noCategoryText, { color: currentColors.mainColor }]}>
                  may the connection be lost please check your connection again
                </Text>
            )}
        </View>

    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        // marginBottom: 20,
    },
    itemsWrapper: {
        //gap: 1,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    item: {
        marginHorizontal: 8,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    categoryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 50
    },
    itemText: {
        fontSize: 14,
        //color: Colors.darkGrey,
        letterSpacing: 0.5,
    },
    itemActive: {
        //backgroundColor: Colors.tint,
        //borderColor: Colors.tint,
    },
    itemTextActive: {
        fontWeight: '600',
        //color: Colors.white,
    },
    emptyMessage: {
        fontSize: 14,
        //color: Colors.darkGrey,
        textAlign: 'center',
        marginTop: 20,
    },
    noCategoryText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    loading: {
        alignItems: 'center',
        marginRight: 10
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
});
