import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';
import { useLanguage } from '@/constants/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Checkbox } from 'react-native-paper';

export default function Signup() {

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    const { i18n } = useLanguage();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header title='Sign up' />

            <View style={styles.content}>

                <View style={styles.form}>
                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={i18n.t('fullName')}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>

                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={i18n.t('email')}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>
                    <View style={styles.padb}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                                placeholder={i18n.t('pass')}
                                placeholderTextColor={currentColors.mainColor}
                                secureTextEntry={!passwordVisible} // toggle password visibility
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                                <MaterialIcons
                                    name={passwordVisible ? 'visibility' : 'visibility-off'}
                                    size={24}
                                    color={currentColors.mainColor}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


                <View style={[styles.padt, styles.noAccount]}>
                    <Checkbox
                        status={isChecked ? 'checked' : 'unchecked'}
                        onPress={() => setIsChecked(!isChecked)}
                        color={currentColors.mainColor}
                    />
                    <Text style={[styles.text2, { color: currentColors.darkGrey }]}>{i18n.t('agree')} </Text>
                    <Link href={`/settings/termofuse`} asChild>
                        <TouchableOpacity><Text style={[styles.textBtnTo, { color: currentColors.mainColor }]}>{i18n.t('termsOfUse')} </Text></TouchableOpacity>
                    </Link>
                    <Text style={[styles.text2, { color: currentColors.darkGrey }]}>{i18n.t('and')} </Text>
                    <Link href={`/settings/privacy`} asChild>
                        <TouchableOpacity ><Text style={[styles.textBtnTo, { color: currentColors.mainColor }]}>{i18n.t('privacy')}</Text></TouchableOpacity>
                    </Link>
                </View>
                <View style={styles.padt}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!isChecked) {
                                alert(i18n.t('pleaseAgreeToTerms'));
                            } else {
                                router.push('/settings/profile');
                            }
                        }}
                        style={[styles.btn, { backgroundColor: currentColors.button }]}
                    >
                        <Text style={[styles.textBtn, { color: currentColors.background }]}>{i18n.t('signup')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.padt, styles.noAccount]}>

                    <Text style={[styles.text, { color: currentColors.darkGrey }]}>{i18n.t('account')} </Text>
                        <TouchableOpacity onPress={() => {router.replace('/settings/login')}}><Text style={[styles.textBtnT, { color: currentColors.mainColor }]}>{i18n.t('login')}</Text></TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        paddingTop: 150
    },
    form: {
        width: '100%',
        paddingHorizontal: 16,
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 10,
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemBtnText: {
        fontSize: 16,
        fontWeight: '500',
    },
    padb: {
        paddingBottom: 10
    },
    padt: {
        paddingTop: 80
    },
    btn: {
        width: 250,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
    },
    text2: {
        fontSize: 12,
        paddingTop: 10
    },
    textBtn: {
        fontSize: 16,
        fontWeight: '500',
    },
    textBtnT: {
        fontSize: 15,
        fontWeight: '500',
    },
    textBtnTo: {
        fontSize: 13,
        fontWeight: '500',
        paddingTop: 10
    },
    noAccount: {
        flexDirection: 'row',
        paddingHorizontal: 16
    },
    checkbox: {
        marginRight: 8,
    },
});
