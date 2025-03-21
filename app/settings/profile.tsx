import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';
import { useLanguage } from '@/constants/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/constants/userContext';
import { useEffect, useState } from 'react';
import apiClient from '@/constants/apiClient';

type Auth = {
    id: number;
    name: string;
    email: string;
};

export default function Profile() {

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    const { i18n } = useLanguage();

    const { logout, accessToken } = useAuth();

    const [auth, setAuth] = useState<Auth | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        fetchAuth();
    }, []);

    const fetchAuth = async () => {
        try {
            if (!accessToken) throw new Error('Authentication token not found.');

            const response = await apiClient.get("/donor/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const result = await response.data;
            setAuth(result);
            setProfileImage(result.profile_image);
            //console.log("Fetched data:", result);

        } catch (err: any) {
            console.log("Error:", err.message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header title={i18n.t('profile')} />

            <View style={styles.content}>
                {/* Profile Picture */}
                <View style={[styles.profilePicContainer, { backgroundColor: currentColors.mainColorWithOpacity , shadowColor: currentColors.black,}]}>
                    {profileImage ? (
                        <TouchableOpacity
                            onPress={() => console.log('Change Profile Picture')}
                            style={styles.profilePicWrapper} // Added a wrapper for better control
                        >
                            <Image source={{ uri: profileImage }} style={[styles.profilePic, {borderColor: currentColors.background}]} />
                            <MaterialIcons
                                name="camera"
                                size={30}
                                color={currentColors.mainColor}
                                style={[styles.changePicIcon,{backgroundColor: currentColors.background,shadowColor: currentColors.black}]}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => console.log('Change Profile Picture')}
                            style={styles.profilePicWrapper} // Added a wrapper for better control
                        >
                            <Image
                                source={require('@/assets/images/noProfile.jpg')}
                                style={[styles.profilePic, {borderColor: currentColors.background}]}
                            />
                            <MaterialIcons
                                name="camera"
                                size={30}
                                color={currentColors.mainColor}
                                style={[styles.changePicIcon,{backgroundColor: currentColors.background,shadowColor: currentColors.black}]}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.form}>
                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={auth ? auth.name : ""}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>
                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={auth ? auth.email : ""}
                            placeholderTextColor={currentColors.mainColor}
                        />
                    </View>
                    {/*<View style={styles.padb}>
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
                    </View>*/}
                    <TouchableOpacity
                        onPress={logout} // Attach function to button
                        style={[styles.itemBtn, { backgroundColor: currentColors.mainColorWithOpacity }]}
                    >
                        <Text style={[styles.itemBtnText, { color: currentColors.tint }]}>{i18n.t('logout')}</Text>
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
        paddingTop: 80,
    },
    profilePicContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, 
    },
    profilePicWrapper: {
        position: 'relative', 
    },
    profilePic: {
        width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
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
    changePicIcon: {
        position: 'absolute',
        bottom: 10, 
        right: 10, 
        borderRadius: 20, 
        padding: 5, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3, 
    }
});
