import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';
import { useLanguage } from '@/constants/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/constants/userContext';
import { useState } from 'react';

export default function Profile() {

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    const { i18n } = useLanguage();

    const { logout } = useUser();

    const profileImage = null;

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header title={i18n.t('profile')} />

            <View style={styles.content}>
                {/* Profile Picture */}
                <View style={[styles.profilePicContainer, { backgroundColor: profileImage ? 'transparent' : currentColors.mainColor }]}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profilePic} />
                    ) : (
                        <Text style={[styles.profilePicText, { color: currentColors.background }]}>Add Image</Text>
                    )}
                </View>
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
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={i18n.t('phoneNumber')}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>
                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={i18n.t('age')}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={logout} // Attach function to button
                        style={[styles.itemBtn, { backgroundColor: currentColors.mainColorWithOpacity }]}
                    >
                        <Text style={[styles.itemBtnText, { color: currentColors.tint }]}>Logout</Text>
                        <MaterialIcons name="logout" size={16} color={currentColors.tint} />
                    </TouchableOpacity>
                </View>
                {/** <View style={styles.padt}>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: currentColors.button }]}>
                        <Text style={[styles.textBtn, { color: currentColors.background }]}>{i18n.t('save')}</Text>
                    </TouchableOpacity>
                </View>*/}
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
        paddingTop: 80
    },
    profilePicContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    profilePicText: {
        fontWeight: 'bold',
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
    itemBtnText: {
        fontSize: 16,
        fontWeight: '500',
    },
    padb: {
        paddingBottom: 10
    },
    padt: {
        paddingTop: 50
    },
    btn: {
        width: 250,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 10
    },
});
