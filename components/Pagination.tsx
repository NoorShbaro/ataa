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

const Pagination = ({items, PaginationIndex, scrollX}: Props) => {
 const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

    return (
        <View style={styles.container}>
            {items.map((_, index) => {
                return (
                    <Animated.View  style={[styles.dot, {backgroundColor: PaginationIndex === index ? currentColors.tint: currentColors.darkGrey}]} key={index}/>
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