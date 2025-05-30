import apiClient from '@/constants/apiClient';
import { DarkColors, LightColors } from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  campaignId: number;
  accessToken: string | null;
  onSuccess?: () => void;
}

const PaymentMethodBottomSheet: React.FC<Props> = ({
  isVisible,
  onClose,
  campaignId,
  accessToken,
  onSuccess,
}) => {
  const [step, setStep] = useState<'choose' | 'amount'>('choose');
  const [method, setMethod] = useState<'cash' | 'credit' | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { i18n, isRTL } = useLanguage();
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  const reset = useCallback(() => {
    setStep("choose");
    setMethod(null);
    setAmount("");
    setLoading(false);
    setShowSuccess(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelect = (selectedMethod: 'cash' | 'credit') => {
    setMethod(selectedMethod);
    setStep('amount');
  };

  const handleDonation = async () => {
    if (!amount) return;
    if (!accessToken) {
      console.error('Authentication token not found.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/donor/donate',
        {
          campaign_id: campaignId,
          amount,
          // method,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // console.log('Donation Successful:', response.data);
      // setShowSuccess(true);
      router.replace('/success/DonationSuccessScreen');
    } catch (err: any) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
      // reset();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      style={styles.modal}
      swipeDirection={'down'}
      onSwipeComplete={handleClose}
      propagateSwipe
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      //style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container,{backgroundColor: currentColors.cardBackground}]}>
            {/* {showSuccess ? (
              <View style={styles.successContainer}>
                <LottieView
                  source={require("@/assets/Lottie/Animation - 1743166826870.json")}
                  autoPlay
                  loop={false}
                  style={{ width: 120, height: 120 }}
                  onAnimationFinish={handleClose}
                />
                <Text style={[styles.successText, { color: currentColors.mainColor }]}>
                  {i18n.t("donationReceived")}
                </Text>
              </View>
            ) :  */}
            {step === 'choose' ? (
              <>
                <Text style={[styles.title,{color: currentColors.mainColor}]}>{i18n.t("choose")}</Text>
                <TouchableOpacity
                  style={[styles.optionButton, {backgroundColor: currentColors.progressBarBackground}]}
                  onPress={() => handleSelect('cash')}
                >
                  <Text style={[styles.optionText,{color: currentColors.mainColor}]}>{i18n.t("cash")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionButton, {backgroundColor: currentColors.calmBlue}]}
                  onPress={() => handleSelect('credit')}
                >
                  <Text style={[styles.optionText, {color: currentColors.background}]}>{i18n.t("credit")}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>
                  {i18n.t("enterAmount")}
                </Text>
                {/*<Text style={styles.methodLabel}>
                  {i18n.t("payby")} <Text style={styles.highlight}>{method?.toUpperCase()}</Text>
                </Text>*/}
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder={i18n.t("enterAmount")}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={[styles.inputWithIcon, {borderColor: currentColors.lightGrey}]}
                  />
                  {amount !== '' && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="green"
                      style={styles.checkIcon}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: currentColors.button, opacity: loading ? 0.5 : 1 },
                  ]}
                  onPress={handleDonation}
                  disabled={loading}
                >
                  <Text style={{ color: currentColors.white, textAlign: "center", fontWeight: "600" }}>
                    {loading ? i18n.t("processing") : i18n.t("confirm")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodLabel: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
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
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  inputWithIcon: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    paddingRight: 35,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});

export default PaymentMethodBottomSheet;
