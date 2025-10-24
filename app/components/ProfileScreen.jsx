import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Edit,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Added

export default function ProfileScreen({ onNavigate, onSignOut }) {
  const [userName, setUserName] = useState("Rahul Sharma");
  const [userEmail, setUserEmail] = useState("rahul.sharma@email.com");
  const [userPhone, setUserPhone] = useState("+91 98765 43210");

  // ✅ Load stored user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem("user_name");
        const email = await AsyncStorage.getItem("user_email");
        const phone = await AsyncStorage.getItem("user_phone");
        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (phone) setUserPhone(phone);
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    };
    loadUserData();
  }, []);

  const menuItems = [
    {
      icon: MapPin,
      label: "Saved Addresses",
      subtitle: "Home, Work & Other addresses",
      action: () => console.log("Addresses"),
    },
    {
      icon: CreditCard,
      label: "Payment Methods",
      subtitle: "Cards, UPI & Wallet",
      action: () => onNavigate("payments"),
    },
    {
      icon: Settings,
      label: "Settings",
      subtitle: "Notifications, Privacy & More",
      action: () => console.log("Settings"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      subtitle: "FAQs, Contact Us",
      action: () => onNavigate("chat"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onNavigate("home")}
        >
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              {/* ✅ Dynamic user info */}
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.phone}>{userPhone}</Text>
              <Text style={styles.email}>{userEmail}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit color="#007bff" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹24K</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={item.action}
              style={styles.menuCard}
            >
              <View style={styles.menuIconBox}>
                <Icon color="#007bff" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Logout */}
        {onSignOut && (
          <TouchableOpacity
            style={[styles.menuCard, { borderColor: "#ef4444" }]}
            activeOpacity={0.8}
            onPress={async () => {
              await AsyncStorage.clear(); // ✅ clear user data on sign out
              onSignOut();
            }}
          >
            <View style={styles.logoutRow}>
              <LogOut color="#ef4444" size={20} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>SuperApp v2.1.0</Text>
          <Text style={styles.appInfoText}>Made with ❤️ in India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginLeft: 10 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
  },
  scroll: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  name: { fontSize: 18, fontWeight: "600", color: "#111827" },
  phone: { color: "#6b7280", marginTop: 2 },
  email: { fontSize: 13, color: "#9ca3af" },
  editButton: {
    borderWidth: 1,
    borderColor: "#dbeafe",
    padding: 8,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 10,
    marginHorizontal: 4,
    elevation: 1,
  },
  statValue: { color: "#007bff", fontSize: 20, fontWeight: "700" },
  statLabel: { color: "#6b7280", fontSize: 13 },
  menuCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuIconBox: {
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  menuLabel: { fontWeight: "600", color: "#111827" },
  menuSub: { fontSize: 12, color: "#6b7280" },
  logoutRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoutText: { color: "#ef4444", fontWeight: "600" },
  appInfo: { alignItems: "center", marginTop: 20 },
  appInfoText: { color: "#9ca3af", fontSize: 13 },
});
