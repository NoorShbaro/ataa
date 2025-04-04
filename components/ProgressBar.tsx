import { DarkColors, LightColors } from "@/constants/Colors";
import { useLanguage } from "@/constants/LanguageContext";
import { useTheme } from "@/constants/ThemeContext";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressBarProps {
    percentage: number;
    raised: number;
    remaining: number;
    goal: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, raised, remaining, goal }) => {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();
    return (
        <View style={styles.container}>
            <Text style={[styles.percentage, { color: currentColors.mainColor,alignSelf: 'flex-end', fontSize: 14 }]}>{percentage}%</Text>
            <View style={[styles.progressBarBackground, { backgroundColor: currentColors.progressBarBackground }]}>
                <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: currentColors.mainColor }]} />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        //padding: 10,
        //alignItems: "center",
        paddingBottom: 20
    },
    progressBarBackground: {
        width: "100%",
        height: 15,
        //backgroundColor: "#1A1A2E",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        //backgroundColor: "#A5B4FC",
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

export default ProgressBar;
