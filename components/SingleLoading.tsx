import { Dimensions, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import MainHeader from './MainHeader';

const { width } = Dimensions.get('screen');

export default function LoadingSingle() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    return (
        <View style={[{ backgroundColor: currentColors.background }]}>
            <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '100%',
                        backgroundColor: currentColors.skeletonBase,
                        position: 'absolute',
                        alignSelf: 'flex-start',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: width,
                    }}
                />
            <View style={{
                flex: 1,
                //justifyContent: 'center',
                //alignItems: 'center',
                marginTop: width + 25,
                margin: 25
            }}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '70%',
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: 'flex-start',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 70,
                    }}
                />
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '50%',
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: 'flex-end',
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
                        width: 120,
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: 'flex-start',
                        marginTop: 25,
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 30,
                    }}
                />
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '100%',
                        backgroundColor: currentColors.skeletonBase,
                        alignSelf: 'flex-start',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        //paddingVertical: 20,
                        borderRadius: 10,
                        height: 15,
                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                        style={{
                            width: '30%',
                            backgroundColor: currentColors.skeletonBase,
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 16,
                            //paddingVertical: 20,
                            borderRadius: 10,
                            height: 25,
                        }}
                    />
                    <MotiView
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ loop: true, type: 'timing', duration: 1000 }}
                        style={{
                            width: '30%',
                            backgroundColor: currentColors.skeletonBase,
                            alignSelf: 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 16,
                            //paddingVertical: 20,
                            borderRadius: 10,
                            height: 25,
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
