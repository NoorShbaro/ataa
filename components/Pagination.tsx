import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from "@/constants/Colors";

type Props = {
    items: Campaigns[],
    PaginationIndex: number,
    scrollX: SharedValue<number>
}

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

const Pagination = ({items, PaginationIndex, scrollX}: Props) => {
 const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

    return (
        <View style={styles.container}>
            {items.map((_, index) => {
                return (
                    <Animated.View  style={[styles.dot, {backgroundColor: PaginationIndex === index ? currentColors.mainColor: currentColors.mainColorWithOpacity}]} key={index}/>
                );
            })}
        </View>
    )
}

export default Pagination

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    dot: {
        backgroundColor: "#333",
        height:8,
        width: 8,
        marginHorizontal:2,
        borderRadius: 8,
    }
})