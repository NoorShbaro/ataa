import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';


type Props = {
    slideItem: Campaigns,
    index: number,
    scrollX: SharedValue<number>
}

const { width } = Dimensions.get('screen');

type Campaigns = {
    id: number;
    title: string;
    body: string;
    description: string;
    goal_amount: string;

    created_at: string;

    ngo: {
        id: number,
        name: string,
    }
};

const SliderItem = ({ slideItem, index, scrollX }: Props) => {
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
    const imageUrl = require('@/assets/images/empty.jpg');
    //const imageUrl = `https://be.apis.dstar.news/storage/${slideItem.featured_image}`;
    //console.log("Image URL:", imageUrl);
    //console.log("Title:", slideItem.title);
    return (
        <Link href={`/campaign/${String(slideItem.id)}`} asChild>
            <TouchableOpacity>
                <Animated.View style={[styles.itemWrapper, rnStyle]} key={slideItem.id}>
                    <Image source={imageUrl} style={styles.image} />
                    <LinearGradient colors={["transparent", 'rgba(0,0,0,0.8)']} style={styles.background}>
                        <View style={styles.sourceInfo}>
                            {/*slideItem.featured_image &&*/ (
                                <Image source={require('@/assets/images/noProfile.jpg')} style={styles.sourceIcon} />
                            )}
                            <Text style={styles.sourceName}>{slideItem.ngo.name}</Text>
                        </View>
                        <Text style={styles.title} numberOfLines={2}>{slideItem.title}</Text>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        </Link>
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
        width: width - 60,
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    background: {
        position: 'absolute',
        left: 30,
        right: 0,
        top: 0,
        width: width - 60,
        height: 200,
        borderRadius: 15,
        padding: 20,
        overflow: 'hidden',
    },
    sourceInfo: {
        flexDirection: 'row',
        position: 'absolute',
        top: 85,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 10
    },
    sourceName: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    sourceIcon: {
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    title: {
        fontSize: 14,
        color: Colors.white,
        position: 'absolute',
        top: 120,
        paddingHorizontal: 20,
        fontWeight: '600',
    }
})