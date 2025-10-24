import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowRight } from "lucide-react-native";

const BASE_URL = "http://10.214.135.184:8000/api"; // ✅ Django backend base URL

export default function SignUpScreen({ onSignUp, onNavigateToSignIn }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step 1️⃣ — Send OTP
  const sendOTP = async () => {
    if (!formData.phoneNumber || !formData.firstName) {
      Alert.alert("Error", "Please enter your name and phone number.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/otp/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phoneNumber,
          purpose: "register",
        }),
      });

      const text = await res.text();
      console.log("OTP API Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from backend.");
      }

      if (res.ok) {
        setOtpSent(true);
        Alert.alert("OTP Sent", `OTP sent to +91 ${formData.phoneNumber}`);
      } else {
        Alert.alert(
          "Error",
          data.detail || data.error || "Failed to send OTP."
        );
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      Alert.alert(
        "Error",
        err.message || "Something went wrong while sending OTP."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2️⃣ — Verify OTP and Register
  const verifyAndRegister = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/user-registration/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phoneNumber,
          otp: otp,
          purpose: "register",
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          city: formData.city,
        }),
      });

      const text = await res.text();
      console.log("Verify OTP Response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from backend.");
      }

      if (res.ok && data.tokens) {
        // ✅ Clear any old data
        await AsyncStorage.multiRemove([
          "access_token",
          "refresh_token",
          "current_user",
        ]);

        // ✅ Save tokens
        await AsyncStorage.setItem("access_token", data.tokens.access);
        await AsyncStorage.setItem("refresh_token", data.tokens.refresh);

        // ✅ Save user info for chat & session persistence
        if (data.user) {
          await AsyncStorage.setItem("current_user", JSON.stringify(data.user));
          await AsyncStorage.setItem(
            "user_name",
            `${data.user.first_name} ${data.user.last_name || ""}`.trim()
          );
        }

        Alert.alert(
          "Welcome!",
          `Account created successfully, ${data.user.first_name}!`
        );
        onSignUp && onSignUp(data.tokens);
      } else {
        Alert.alert(
          "Error",
          data.detail || "Invalid OTP or registration failed."
        );
      }
    } catch (err) {
      console.error("Verify OTP Error:", err);
      Alert.alert(
        "Error",
        err.message || "Something went wrong during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <View style={styles.logoDot} />
              </View>
            </View>
            <Text style={styles.title}>Join SuperApp!</Text>
            <Text style={styles.subtitle}>
              Create your account to get started
            </Text>
          </View>

          {/* === Sign Up Form === */}
          <View style={styles.form}>
            {!otpSent ? (
              <>
                <View style={styles.row}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      value={formData.firstName}
                      onChangeText={(t) => handleInputChange("firstName", t)}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      value={formData.lastName}
                      onChangeText={(t) => handleInputChange("lastName", t)}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.phoneRow}>
                    <View style={styles.countryCode}>
                      <Text style={{ color: "#6b7280" }}>+91</Text>
                    </View>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Enter phone number"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChangeText={(t) => handleInputChange("phoneNumber", t)}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(t) => handleInputChange("email", t)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your city"
                    value={formData.city}
                    onChangeText={(t) => handleInputChange("city", t)}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    (!formData.phoneNumber ||
                      !formData.firstName ||
                      isLoading) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={sendOTP}
                  disabled={
                    !formData.phoneNumber || !formData.firstName || isLoading
                  }
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Send OTP</Text>
                      <ArrowRight color="#fff" size={18} />
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Enter OTP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <Text style={styles.helperText}>
                    OTP sent to +91 {formData.phoneNumber}
                  </Text>
                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.linkText}>Change details</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.button,
                    (!otp || isLoading) && styles.buttonDisabled,
                  ]}
                  onPress={verifyAndRegister}
                  disabled={!otp || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>
                        Verify & Create Account
                      </Text>
                      <ArrowRight color="#fff" size={18} />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Already have account */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignIn}>
              <Text style={styles.linkText}> Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 10 },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoOuter: {
    width: 70,
    height: 70,
    backgroundColor: "#007bff",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoInner: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoDot: { width: 20, height: 20, backgroundColor: "#007bff", borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  form: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRightWidth: 0,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#f3f4f6",
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "600", marginRight: 8, fontSize: 16 },
  helperText: { color: "#6b7280", fontSize: 12, marginTop: 4 },
  linkText: { color: "#007bff", fontWeight: "500" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: { color: "#6b7280", fontSize: 14 },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 20,
    paddingHorizontal: 30,
    lineHeight: 18,
  },
});
