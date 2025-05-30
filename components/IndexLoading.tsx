import { Dimensions, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import MainHeader from './MainHeader';
import { useLanguage } from '@/constants/LanguageContext';

const { width } = Dimensions.get('screen');

export default function LoadingIndex() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { isRTL } = useLanguage();

    return (
        <View style={[{ backgroundColor: currentColors.background }]}>
            <View style={{//alignItems: 'center',
                //justifyContent: 'center',
                width: width - 60,
                height: 200,
                borderRadius: 15,
                //top: 100,
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: 30
            }}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '100%',
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 200,
                    }}
                />

            </View>

            <View style={{
                marginHorizontal: 15, flexDirection: isRTL ? 'row-reverse' : 'row',
                marginTop: 30
            }}>
                <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
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
                <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
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
                <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
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

            <View style={{ padding: 10, marginLeft: isRTL ? 0 : 5, marginRight: isRTL ? 5 : 0 }}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '45%',
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: isRTL ? 'flex-end' : 'flex-start',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 40,
                    }}
                />
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: 200,
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: isRTL ? 'flex-end' : 'flex-start',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 250,
                    }}
                />
            </View>
        </View>
    );
}
