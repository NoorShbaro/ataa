import apiClient from "@/constants/apiClient";
import { DarkColors, LightColors } from "@/constants/Colors";
import { useTheme } from "@/constants/ThemeContext";
import { useLanguage } from "@/hook/LanguageContext";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Modal from "react-native-modal";

interface AmountModalProps {
    isVisible: boolean;
    accessToken: string | null;
    campaignId: number;
    onClose: () => void; // Keep onClose only to close the modal
}

const AmountModal: React.FC<AmountModalProps> = ({ isVisible, accessToken, campaignId, onClose }) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const { i18n, isRTL } = useLanguage();
    const { isDarkMode } = useTheme();
    const currentColors = isDarkMode ? DarkColors : LightColors;
    const [showSuccess, setShowSuccess] = useState(false);

    const handleDonation = async () => {
        if (!amount) return;
        if (!accessToken) {
            console.error("Authentication token not found.");
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post("/donor/donate", {
                campaign_id: campaignId,
                amount,
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            console.log("Donation Successful:", response.data);
            setAmount("");
            setShowSuccess(true);
        } catch (err: any) {
            console.error("Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={[styles.modalContainer, { backgroundColor: currentColors.background }]}>
                {showSuccess ? (
                    <View style={styles.successContainer}>
                        <LottieView
                            source={require("@/assets/Lottie/Animation - 1743166826870.json")}
                            autoPlay
                            loop={false}
                            style={{ width: 100, height: 100 }}
                            onAnimationFinish={onClose}
                        />
                        <Text style={[styles.successText, { color: currentColors.mainColor }]}>
                            {i18n.t("donationReceived")}
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={[styles.title, { color: currentColors.mainColor, textAlign: isRTL ? 'right' : 'left' }]}>
                            {i18n.t("enterAmount")}
                        </Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: currentColors.button, color: currentColors.mainColor },
                            ]}
                            placeholder={i18n.t("enterAmount")}
                            placeholderTextColor={currentColors.darkGrey}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: currentColors.button, opacity: loading ? 0.5 : 1 },
                            ]}
                            onPress={handleDonation}
                            disabled={loading}
                        >
                            <Text style={{ color: currentColors.white, textAlign: "center", fontWeight: "600" }}>
                                {loading ? i18n.t("processing") : i18n.t("donateNow")}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        padding: 16,
        borderRadius: 16,
        //shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
    },
    successContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    successText: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },
});

export default AmountModal;
