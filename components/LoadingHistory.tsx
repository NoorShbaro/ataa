import { Dimensions, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from '@/constants/Colors';
import MainHeader from './MainHeader';

const { width } = Dimensions.get('screen');

export default function LoadingHistory() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    return (
        <View style={[{ backgroundColor: currentColors.background }]}>
            <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '95%',
                        backgroundColor: currentColors.skeletonBase,
                        //position: 'absolute',
                        alignSelf: 'center',
                        marginBottom: 10,
                        marginTop: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 110,
                    }}
                />

<MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '95%',
                        backgroundColor: currentColors.skeletonBase,
                        //position: 'absolute',
                        alignSelf: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 110,
                    }}
                />

<MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ loop: true, type: 'timing', duration: 1000 }}
                    style={{
                        width: '95%',
                        backgroundColor: currentColors.skeletonBase,
                        //position: 'absolute',
                        alignSelf: 'center',
                        marginBottom: 10,
                        paddingHorizontal: 16,
                        paddingVertical: 20,
                        borderRadius: 10,
                        height: 110,
                    }}
                />
            
        </View>
    );
}
