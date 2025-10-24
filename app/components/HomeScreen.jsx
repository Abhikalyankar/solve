import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  Search,
  Bell,
  Wallet,
  Car,
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Tv,
  Wrench,
  Package,
  Gift,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ added

export default function HomeScreen({ onNavigate }) {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotification, setShowNotification] = useState(true);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState(""); // ✅ added

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    // ✅ Load stored user name
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem("user_name");
        if (name) setUserName(name);
      } catch (err) {
        console.error("Error loading user name:", err);
      }
    };
    loadUserName();

    return () => clearInterval(timer);
  }, []);

  const services = [
    { id: "ride", icon: Car, label: "Ride", color: "#dbeafe", iconColor: "#2563eb", discount: "20% OFF" },
    { id: "food", icon: UtensilsCrossed, label: "Food", color: "#ffedd5", iconColor: "#ea580c", new: true },
    { id: "grocery", icon: ShoppingCart, label: "Grocery", color: "#dcfce7", iconColor: "#16a34a", discount: "Free delivery" },
    { id: "medicine", icon: Pill, label: "Medicine", color: "#fee2e2", iconColor: "#dc2626" },
    { id: "subscriptions", icon: Tv, label: "Subscriptions", color: "#f3e8ff", iconColor: "#7e22ce", trending: true },
    { id: "home-services", icon: Wrench, label: "Home Services", color: "#e0e7ff", iconColor: "#4338ca" },
  ];

  const quickActions = [
    { label: "Pay Bills", action: () => onNavigate("payments"), icon: "💡" },
    { label: "Recharge", action: () => onNavigate("payments"), icon: "📱" },
    { label: "Send Money", action: () => onNavigate("payments"), icon: "💸" },
  ];

  const offers = [
    { title: "Flat ₹100 OFF", subtitle: "On your first food order", bg: "#fb923c" },
    { title: "50% Cashback", subtitle: "On medicine orders above ₹500", bg: "#22c55e" },
    { title: "Free Delivery", subtitle: "On grocery orders this weekend", bg: "#a855f7" },
  ];

  const recentActivity = [
    { id: "1", type: "food", icon: UtensilsCrossed, title: "Food order delivered", subtitle: "Burger King • 2 hours ago", amount: "₹240", color: "#dcfce7", iconColor: "#16a34a" },
    { id: "2", type: "ride", icon: Car, title: "Ride completed", subtitle: "Home to Office • Yesterday", amount: "₹180", color: "#dbeafe", iconColor: "#2563eb" },
    { id: "3", type: "payment", icon: Wallet, title: "Bill payment", subtitle: "Electricity Bill • 2 days ago", amount: "₹1,200", color: "#f3e8ff", iconColor: "#7e22ce" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* ✅ Dynamic greeting with user name */}
          <Text style={styles.greeting}>
            {greeting}, {userName || "Rahul"}!
          </Text>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => onNavigate("payments")} style={styles.headerIcon}>
            <Wallet color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell color="#fff" size={20} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search color="#6b7280" size={18} style={{ marginHorizontal: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services, food, rides..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Notification Banner */}
        {showNotification && (
          <View style={styles.notificationCard}>
            <View style={styles.notificationLeft}>
              <View style={styles.giftIcon}>
                <Gift color="#fff" size={16} />
              </View>
              <View>
                <Text style={styles.notificationTitle}>Special Offer!</Text>
                <Text style={styles.notificationSub}>
                  Get ₹100 cashback on your next order
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowNotification(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Offers */}
        <Text style={styles.sectionTitle}>🔥 Special Offers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {offers.map((offer, i) => (
            <View key={i} style={[styles.offerCard, { backgroundColor: offer.bg }]}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSub}>{offer.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map((a, i) => (
            <TouchableOpacity key={i} style={styles.quickButton} onPress={a.action}>
              <Text style={styles.quickIcon}>{a.icon}</Text>
              <Text style={styles.quickText}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <Text style={styles.sectionTitle}>🧩 Services</Text>
        <View style={styles.grid}>
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <TouchableOpacity
                key={s.id}
                style={styles.serviceCard}
                onPress={() => onNavigate(s.id)}
              >
                <View style={[styles.serviceIconBox, { backgroundColor: s.color }]}>
                  <Icon color={s.iconColor} size={24} />
                </View>
                <Text style={styles.serviceLabel}>{s.label}</Text>
                {s.discount && <Text style={styles.serviceOffer}>{s.discount}</Text>}
                {s.new && <Text style={styles.newBadge}>NEW</Text>}
                {s.trending && <Text style={styles.trendBadge}>🔥</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* My Orders */}
        <TouchableOpacity style={styles.ordersCard} onPress={() => onNavigate("orders")}>
          <View style={styles.ordersRow}>
            <Package color="#007bff" size={22} />
            <View>
              <Text style={styles.orderTitle}>My Orders</Text>
              <Text style={styles.orderSub}>Track your orders</Text>
            </View>
          </View>
          <Text style={styles.activeOrders}>3 Active</Text>
        </TouchableOpacity>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
        {recentActivity.map((a) => {
          const Icon = a.icon;
          return (
            <View key={a.id} style={styles.activityCard}>
              <View style={[styles.activityIconBox, { backgroundColor: a.color }]}>
                <Icon color={a.iconColor} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activitySub}>{a.subtitle}</Text>
              </View>
              <Text style={styles.activityAmount}>{a.amount}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#007bff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greeting: { color: "#fff", fontSize: 18, fontWeight: "600" },
  date: { color: "#f3f4f6", fontSize: 13 },
  iconRow: { flexDirection: "row", gap: 10 },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 10,
    position: "relative",
  },
  badge: {
    backgroundColor: "#facc15",
    borderRadius: 10,
    width: 16,
    height: 16,
    position: "absolute",
    top: -4,
    right: -4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, color: "#000", fontWeight: "600" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: -10,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  notificationLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  giftIcon: { backgroundColor: "#22c55e", padding: 6, borderRadius: 20 },
  notificationTitle: { fontWeight: "600", color: "#111827" },
  notificationSub: { fontSize: 12, color: "#6b7280" },
  closeText: { fontSize: 16, color: "#6b7280" },
  sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 10 },
  offerCard: { width: 250, borderRadius: 10, padding: 16, marginRight: 10 },
  offerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  offerSub: { color: "#fff", opacity: 0.9 },
  quickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
    elevation: 1,
  },
  quickIcon: { fontSize: 18, marginRight: 6 },
  quickText: { fontWeight: "500", fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "30%",
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },
  serviceIconBox: { borderRadius: 10, padding: 10, marginBottom: 6 },
  serviceLabel: { fontWeight: "600", fontSize: 13 },
  serviceOffer: { color: "#007bff", fontSize: 11, fontWeight: "500" },
  newBadge: {
    backgroundColor: "#16a34a",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
    position: "absolute",
    top: 6,
    right: 6,
  },
  trendBadge: { position: "absolute", top: 6, right: 6, fontSize: 14 },
  ordersCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  ordersRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  orderTitle: { fontWeight: "600", color: "#111827" },
  orderSub: { color: "#6b7280", fontSize: 13 },
  activeOrders: { color: "#007bff", fontWeight: "600" },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
    elevation: 1,
  },
  activityIconBox: { padding: 6, borderRadius: 8, marginRight: 10 },
  activityTitle: { fontWeight: "600", color: "#111827" },
  activitySub: { fontSize: 12, color: "#6b7280" },
  activityAmount: { fontWeight: "600", color: "#111827" },
});
