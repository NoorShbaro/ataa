import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, DarkColors, LightColors } from '@/constants/Colors';
import { router } from 'expo-router';
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
    const { i18n, isRTL } = useLanguage();
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
        ? { uri: `${slideItem.featured_image}` }
        : require('@/assets/images/empty.jpg');
    //const imageUrl = `https://be.apis.dstar.news/storage/${slideItem.featured_image}`;
    //console.log("Image URL:", imageUrl);
    //console.log("Title:", slideItem.title);
    return (
        <Animated.View style={[styles.itemWrapper, rnStyle]} key={slideItem.id}>
            <Image source={imageUrl} style={[styles.image, { shadowColor: currentColors.calmBlue }]} />
            <LinearGradient colors={["transparent", currentColors.calmBlue]} style={[styles.background,]}>
                <View style={[styles.contentWrapper,{flexDirection: isRTL? 'row-reverse': 'row'}]}>

                    <Text style={[styles.title, { color: currentColors.white }]} numberOfLines={2}>{slideItem.title}</Text>


                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => router.push(`/campaign/${slideItem.id}`)}
                            style={[
                                styles.buttonContainer,
                                { backgroundColor: currentColors.button }
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: currentColors.white }]}>
                                {i18n.t('donateNow')}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        width: width - 50,
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        resizeMode: 'cover',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    background: {
        position: 'absolute',
        width: width - 50,
        height: 200,
        borderRadius: 15,
        padding: 20,
        overflow: 'hidden',
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        position: 'relative',
        paddingHorizontal: 20,
        fontWeight: '600',
    },
    button: {
        padding: 10,
        borderRadius: 15,
        alignSelf: 'center'
    },
    buttonContainer: {
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
      },
      buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
      },
})