import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, DarkColors, LightColors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { useLanguage } from '@/hook/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { useAuth } from '@/constants/userContext';
import apiClient from '@/constants/apiClient';


type Props = {
    slideItem: Campaigns,
    index: number,
    scrollX: SharedValue<number>,
}

const { width } = Dimensions.get('screen');

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
};

const SliderItem = ({ slideItem, index, scrollX }: Props) => {
    const { i18n } = useLanguage();
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { accessToken } = useAuth();

    

    const rnStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [-width * 0.15, 0, width * 0.15],
                        Extrapolation.CLAMP
                    )
                },
                {
                    scale: interpolate(
                        scrollX.value,
                        [(index - 1) * width, index * width, (index + 1) * width],
                        [0.9, 1, 0.9],
                        Extrapolation.CLAMP
                    )
                }
            ]
        };
    });
    const imageUrl = slideItem.featured_image
        ? { uri: `https://be.donation.matrixvert.com/storage/${slideItem.featured_image}` }
        : require('@/assets/images/empty.jpg');
    //const imageUrl = `https://be.apis.dstar.news/storage/${slideItem.featured_image}`;
    //console.log("Image URL:", imageUrl);
    //console.log("Title:", slideItem.title);
    return (
            <Animated.View style={[styles.itemWrapper, rnStyle]} key={slideItem.id}>
                <Image source={imageUrl} style={styles.image} />
                <LinearGradient colors={["transparent", currentColors.lightGrey]} style={styles.background}>
                    <View style={styles.contentWrapper}>

                        <Text style={[styles.title, { color: currentColors.black }]} numberOfLines={2}>{slideItem.title}</Text>


                        <TouchableOpacity onPress={()=> router.push(`/campaign/${slideItem.id}`)}>
                            <Text style={[styles.button, { backgroundColor: currentColors.mainColorWithOpacity, color: currentColors.black }]}>{i18n.t('donateNow')}</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Animated.View>
    )
}

export default SliderItem

const styles = StyleSheet.create({
    itemWrapper: {
        position: 'relative',
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width - 30,
        height: 150,
        borderRadius: 15,
        overflow: 'hidden',
        resizeMode: 'cover',
        //marginLeft: 5,
    },
    background: {
        position: 'absolute',
        width: width - 30,
        height: 150,
        borderRadius: 15,
        padding: 20,
        overflow: 'hidden',
        //marginLeft: 5
    },
    contentWrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    title: {
        fontSize: 14,
        position: 'relative',
        top: 55,
        paddingHorizontal: 20,
        fontWeight: '600',
    },
    button: {
        padding: 10,
        borderRadius: 15,
        top: 50,
    }
})