import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';
import { useLanguage } from '@/constants/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Checkbox } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/constants/userContext';

export default function Signup() {

    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;

    const { i18n } = useLanguage();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { logout } = useUser();

    useEffect(() => {
        const checkTokenValidity = async () => {
            const expired = await isTokenExpired();
            if (expired) {
                await refreshTokenHandler();
            }
        };

        const interval = setInterval(checkTokenValidity, 10 * 1000);
        checkTokenValidity();

        return () => clearInterval(interval);
    }, []);

    const handleSignup = async () => {
        if (!fullName || !email || !password) {
            alert(i18n.t('pleaseFillAllFields'));
            return;
        }

        if (!isChecked) {
            alert(i18n.t('pleaseAgreeToTerms'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://be.donation.matrixvert.com/api/donor/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Extract the data from the response
                const { donor, access_token, refresh_token, expires_in } = data;

                // Save the donor details and tokens in SecureStore/AsyncStorage
                await saveUserData(donor, access_token, refresh_token, expires_in);

                // Navigate to the profile page
                router.replace('/settings/profile');
            } else {
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please check your internet connection.');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to save user data, tokens, and other details
    const saveUserData = async (donor: any, accessToken: string, refreshToken: string, expiresIn: number) => {
        try {
            // Save donor data
            await SecureStore.setItemAsync('donor', JSON.stringify(donor));

            // Save tokens and expiry time
            const expiryTimestamp = Date.now() + expiresIn * 1000; // Convert expires_in to milliseconds
            await SecureStore.setItemAsync('userToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('tokenExpiry', JSON.stringify(expiryTimestamp));

            // Optionally, save isLoggedIn status to track user state
            await AsyncStorage.setItem('isLoggedIn', 'true');

            console.log('User data and tokens saved successfully');
        } catch (error) {
            console.error('Failed to save user data and tokens:', error);
        }
    };

    const saveToken = async (accessToken: string, refreshToken: string, expiresIn: number): Promise<void> => {
        try {
            const expiryTimestamp = Date.now() + expiresIn * 1000;
            await SecureStore.setItemAsync('userToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await AsyncStorage.setItem('tokenExpiry', expiryTimestamp.toString());
        } catch (error) {
            console.error('Failed to save token:', error);
        }
    };

    const isTokenExpired = async (): Promise<boolean> => {
        try {
            const expiryTimestamp = await AsyncStorage.getItem('tokenExpiry');
            return !expiryTimestamp || Date.now() > Number(expiryTimestamp);
        } catch (error) {
            console.error('Failed to check token expiration:', error);
            return true;
        }
    };

    const refreshTokenHandler = async (): Promise<void> => {
        try {
            const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
            if (!storedRefreshToken) {
                console.log('No valid refresh token found');
                return;
            }

            const response = await fetch('http://be.donation.matrixvert.com/api/donor/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedRefreshToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log('Refresh token expired or invalid, logging out...');
                await logout();
                return;
            }

            const data = await response.json();
            await saveToken(data.access_token, storedRefreshToken, data.expires_in);
        } catch (error) {
            console.error('Error refreshing token:', error);
            await logout();
        }
    };

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
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.padb}>
                        <TextInput
                            style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                            placeholder={i18n.t('email')}
                            placeholderTextColor={currentColors.mainColor}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.padb}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, { color: currentColors.mainColor, backgroundColor: currentColors.mainColorWithOpacity }]}
                                placeholder={i18n.t('pass')}
                                placeholderTextColor={currentColors.mainColor}
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={setPassword}
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

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
                        onPress={handleSignup} // Call the signup function
                        style={[styles.btn, { backgroundColor: currentColors.button }]}
                    >
                        {loading ? (
                            <ActivityIndicator color={currentColors.background} />
                        ) : (
                            <Text style={[styles.textBtn, { color: currentColors.background }]}>{i18n.t('signup')}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.padt, styles.noAccount]}>
                    <Text style={[styles.text, { color: currentColors.darkGrey }]}>{i18n.t('account')} </Text>
                    <TouchableOpacity onPress={() => { router.replace('/settings/login') }}><Text style={[styles.textBtnT, { color: currentColors.mainColor }]}>{i18n.t('login')}</Text></TouchableOpacity>
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
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
});
