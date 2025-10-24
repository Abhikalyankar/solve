import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, Phone, Mail, ArrowRight } from "lucide-react-native";

// 🌍 Replace with your backend API URL (Django → 8000, Flask → 8001)
const BASE_URL = "http://10.214.135.184:8000/api";

export default function SignInScreen({ onSignIn, onNavigateToSignUp }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("phone");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field, value) => {
    const errors = { ...formErrors };
    switch (field) {
      case "phone":
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          errors.phone = "Enter a valid phone number";
        } else delete errors.phone;
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Enter a valid email";
        } else delete errors.email;
        break;
      case "password":
        if (value && value.length < 6) {
          errors.password = "Password must be 6+ characters";
        } else delete errors.password;
        break;
    }
    setFormErrors(errors);
  };

  // 📱 PHONE OTP SIGN-IN FLOW
  const handlePhoneSignIn = async () => {
    try {
      if (!phoneNumber) return;
      setIsLoading(true);

      if (!otpSent) {
        // Step 1️⃣ Send OTP
        const res = await fetch(`${BASE_URL}/otp/send-otp/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phoneNumber,
            purpose: "login",
          }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
          setOtpSent(true);
          Alert.alert("OTP Sent", `OTP sent to +91 ${phoneNumber}`);
        } else {
          Alert.alert(
            "Error",
            data.detail || data.error || "Failed to send OTP"
          );
        }
      } else {
        // Step 2️⃣ Verify OTP & Login
        const res = await fetch(`${BASE_URL}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phoneNumber,
            otp: otp,
          }),
        });

        const data = await res.json();
        setIsLoading(false);

        if (res.ok) {
          // 🔐 Clear old session data
          await AsyncStorage.multiRemove([
            "access_token",
            "refresh_token",
            "current_user",
          ]);

          // ✅ Store tokens
          await AsyncStorage.setItem("access_token", data.tokens.access);
          await AsyncStorage.setItem("refresh_token", data.tokens.refresh);

          // ✅ Save full user info (for chat identity)
          if (data.user) {
            await AsyncStorage.setItem(
              "current_user",
              JSON.stringify(data.user)
            );
            await AsyncStorage.setItem("user_name", data.user.first_name || "");
          }

          Alert.alert(
            "Login Successful",
            `Welcome back, ${data.user.first_name || "User"}!`
          );
          onSignIn && onSignIn(data.tokens);
        } else {
          Alert.alert("Invalid OTP", data.detail || "Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // ✉️ EMAIL LOGIN FLOW
  const handleEmailSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        // 🔐 Clear old session data
        await AsyncStorage.multiRemove([
          "access_token",
          "refresh_token",
          "current_user",
        ]);

        // ✅ Store new tokens
        await AsyncStorage.setItem("access_token", data.tokens.access);
        await AsyncStorage.setItem("refresh_token", data.tokens.refresh);

        // ✅ Save full user info for chat
        if (data.user) {
          await AsyncStorage.setItem(
            "current_user",
            JSON.stringify(data.user)
          );
          await AsyncStorage.setItem("user_name", data.user.first_name || "");
        }

        Alert.alert(
          "Login Successful",
          `Welcome back, ${data.user.first_name || "User"}!`
        );
        onSignIn && onSignIn(data.tokens);
      } else {
        Alert.alert("Error", data.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <View style={styles.logoDot} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to your SuperApp account
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "phone" && styles.activeTab]}
              onPress={() => setActiveTab("phone")}
            >
              <Phone
                size={18}
                color={activeTab === "phone" ? "#007bff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "phone" && styles.activeTabText,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "email" && styles.activeTab]}
              onPress={() => setActiveTab("email")}
            >
              <Mail
                size={18}
                color={activeTab === "email" ? "#007bff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "email" && styles.activeTabText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* === PHONE LOGIN === */}
          {activeTab === "phone" && (
            <View style={styles.form}>
              {!otpSent ? (
                <>
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
                      value={phoneNumber}
                      onChangeText={(t) => {
                        setPhoneNumber(t);
                        validateField("phone", t);
                      }}
                    />
                  </View>
                  {formErrors.phone && (
                    <Text style={styles.errorText}>{formErrors.phone}</Text>
                  )}
                </>
              ) : (
                <>
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
                    OTP sent to +91 {phoneNumber}
                  </Text>
                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.linkText}>Change number</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  ((!phoneNumber && !otpSent) ||
                    (otpSent && !otp) ||
                    isLoading) &&
                    styles.buttonDisabled,
                ]}
                onPress={handlePhoneSignIn}
                disabled={
                  (!phoneNumber && !otpSent) || (otpSent && !otp) || isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {!otpSent ? "Send OTP" : "Verify OTP"}
                    </Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* === EMAIL LOGIN === */}
          {activeTab === "email" && (
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  validateField("email", t);
                }}
              />
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    validateField("password", t);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  (!email || !password || Object.keys(formErrors).length > 0) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleEmailSignIn}
                disabled={
                  !email ||
                  !password ||
                  Object.keys(formErrors).length > 0 ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signInText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.linkText}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
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
  logoDot: {
    width: 20,
    height: 20,
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: { backgroundColor: "#fff" },
  tabText: { marginLeft: 6, color: "#6b7280", fontWeight: "500" },
  activeTabText: { color: "#007bff" },
  form: { paddingHorizontal: 20 },
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
  passwordRow: { flexDirection: "row", alignItems: "center" },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "600", marginRight: 8, fontSize: 16 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  helperText: { color: "#6b7280", fontSize: 12, marginTop: 4 },
  linkText: { color: "#007bff", fontWeight: "500" },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: { color: "#6b7280", fontSize: 14 },
});