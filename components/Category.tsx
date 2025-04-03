import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useTheme } from '@/constants/ThemeContext';
import { Colors, DarkColors, LightColors } from "@/constants/Colors";
import { Link, router } from 'expo-router';
import apiClient from '@/constants/apiClient';
import { MotiView } from 'moti';

type Category = {
    id: number;
    name: string;
};

const Categories = () => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<(React.ElementRef<typeof TouchableOpacity> | null)[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
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
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsWrapper}

            >
                {loading ? (
                    <>
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: 'timing', duration: 1000 }}
                            style={{
                                width: 70,
                                backgroundColor: currentColors.skeletonBase,
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 35,
                                height: 70,
                            }}
                        />
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: 'timing', duration: 1000 }}
                            style={{
                                width: 70,
                                backgroundColor: currentColors.skeletonBase,
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 35,
                                height: 70,
                            }}
                        />
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: 'timing', duration: 1000 }}
                            style={{
                                width: 70,
                                backgroundColor: currentColors.skeletonBase,
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 35,
                                height: 70,
                            }}
                        />
                        <MotiView
                            from={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ loop: true, type: 'timing', duration: 1000 }}
                            style={{
                                width: 70,
                                backgroundColor: currentColors.skeletonBase,
                                alignSelf: 'flex-start',
                                marginBottom: 10,
                                paddingHorizontal: 16,
                                paddingVertical: 20,
                                borderRadius: 35,
                                height: 70,
                            }}
                        />

                    </>
                ) :
                    categories.length > 0 ? (
                        categories.map((category, index) => (
                            <TouchableOpacity
                                ref={(el) => (itemRef.current[index] = el)}
                                key={category.id}
                                style={[styles.item, { borderColor: currentColors.mainColor },
                                ]}
                            >
                                <Text
                                    style={[[styles.itemText, { color: currentColors.darkGrey, }],]}
                                >
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={[styles.noCategoryText, { color: currentColors.mainColor }]}>No categories available.</Text>
                    )}
            </ScrollView>
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
       // marginBottom: 20,
    },
    text: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        //color: Colors.black,
        paddingTop: 20,
        marginBottom: 10,
    },
    viewAll: {
        fontSize: 14,
        //color: Colors.darkGrey,
        textTransform: 'capitalize',
    },
    itemsWrapper: {
        gap: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    item: {
        //borderWidth: 1,
        //borderColor: Colors.darkGrey,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
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
});
