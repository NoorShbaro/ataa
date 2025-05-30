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

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { isRTL } = useLanguage();
    const { i18n } = useLanguage();
    return (
        <View style={styles.container}>
            <View style={[
                styles.progressBarBackground,
                {
                    backgroundColor: currentColors.progressBarBackground,
                    flexDirection:  'row'
                }
            ]}>
                <View style={[
                    styles.progressBarFill,
                    {
                        width: `${percentage}%`,
                        backgroundColor: currentColors.calmBlue
                    }
                ]} />
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[
                    styles.percentage,
                    {
                        color: currentColors.mainColor,
                        alignSelf: isRTL ? 'flex-start' : 'flex-end',
                        fontSize: 14,
                        // textAlign: isRTL ? 'left' : 'right'
                    }
                ]}>
                    {i18n.t('raised')}: 
                </Text>
                <Text style={[
                    styles.percentage,
                    {
                        color: currentColors.mainColor,
                        alignSelf: isRTL ? 'flex-start' : 'flex-end',
                        fontSize: 14,
                        // textAlign: isRTL ? 'left' : 'right'
                    }
                ]}>
                    {percentage}%
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        //padding: 10,
        //alignItems: "center",
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
