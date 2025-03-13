import { Text, View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import Header from '@/components/Header';
import { useLanguage } from '@/constants/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@/constants/userContext';

export default function Login() {
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const { i18n } = useLanguage();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login, error } = useAuth();
    
    const handleLogin = () => {
        setIsLoading(true);

        try {
            login(email, password);
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header title={i18n.t('login')} />

            <View style={styles.content}>
                <View style={styles.form}>
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

                <View style={styles.padt}>
                    <TouchableOpacity onPress={handleLogin} style={[styles.btn, { backgroundColor: currentColors.button }]} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={currentColors.background} />
                        ) : (
                            <Text style={[styles.textBtn, { color: currentColors.background }]}>{i18n.t('login')}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.padt, styles.noAccount]}>
                    <Text style={[styles.text, { color: currentColors.darkGrey }]}>{i18n.t('noAccount')} </Text>
                    <TouchableOpacity onPress={() => router.replace('/settings/signup')}>
                        <Text style={[styles.textBtnT, { color: currentColors.mainColor }]}>{i18n.t('signup')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.padt, styles.noAccount]}>
                    <Text style={[styles.text2, { color: currentColors.darkGrey }]}>{i18n.t('signing')} </Text>
                    <Link href={`/settings/termofuse`} asChild>
                        <TouchableOpacity>
                            <Text style={[styles.textBtnTo, { color: currentColors.mainColor }]}>{i18n.t('termsOfUse')} </Text>
                        </TouchableOpacity>
                    </Link>
                    <Text style={[styles.text2, { color: currentColors.darkGrey }]}>{i18n.t('and')} </Text>
                    <Link href={`/settings/privacy`} asChild>
                        <TouchableOpacity>
                            <Text style={[styles.textBtnTo, { color: currentColors.mainColor }]}>{i18n.t('privacy')}</Text>
                        </TouchableOpacity>
                    </Link>
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
        paddingTop: 150,
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
    padb: {
        paddingBottom: 10,
    },
    padt: {
        paddingTop: 40,
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
    textBtnT: {
        fontSize: 15,
        fontWeight: '500',
    },
    textBtnTo: {
        fontSize: 13,
        fontWeight: '500',
    },
    text: {
        fontSize: 14,
    },
    text2: {
        fontSize: 12,
    },
    noAccount: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
});
