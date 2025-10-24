import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Play,
  Tv,
  Music,
  BookOpen,
  Gamepad2,
  Crown,
} from "lucide-react-native";

export default function SubscriptionsScreen({ onNavigate }) {
  const subscriptions = [
    {
      id: "netflix",
      name: "Netflix",
      category: "Video Streaming",
      price: 649,
      period: "month",
      icon: Tv,
      color: "#fee2e2",
      iconColor: "#dc2626",
      status: "active",
      renewsOn: "Mar 15, 2024",
      image:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop",
    },
    {
      id: "spotify",
      name: "Spotify Premium",
      category: "Music Streaming",
      price: 119,
      period: "month",
      icon: Music,
      color: "#dcfce7",
      iconColor: "#15803d",
      status: "active",
      renewsOn: "Mar 22, 2024",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    },
    {
      id: "prime",
      name: "Amazon Prime",
      category: "Shopping & Video",
      price: 1499,
      period: "year",
      icon: Crown,
      color: "#dbeafe",
      iconColor: "#2563eb",
      status: "active",
      renewsOn: "Sep 10, 2024",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop",
    },
  ];

  const availableServices = [
    {
      id: "hotstar",
      name: "Disney+ Hotstar",
      category: "Video Streaming",
      price: 299,
      period: "month",
      icon: Play,
      color: "#e0e7ff",
      iconColor: "#4338ca",
      offer: "50% OFF",
    },
    {
      id: "kindle",
      name: "Kindle Unlimited",
      category: "Books & Reading",
      price: 149,
      period: "month",
      icon: BookOpen,
      color: "#ffedd5",
      iconColor: "#ea580c",
      offer: "Free Trial",
    },
    {
      id: "gamepass",
      name: "Xbox Game Pass",
      category: "Gaming",
      price: 489,
      period: "month",
      icon: Gamepad2,
      color: "#dcfce7",
      iconColor: "#16a34a",
      offer: "3 Months Free",
    },
  ];

  const totalMonthlySpend = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce(
      (total, sub) => total + (sub.period === "month" ? sub.price : sub.price / 12),
      0
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate("home")}
          >
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscriptions</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search style={styles.searchIcon} size={18} color="#cbd5e1" />
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="#e2e8f0"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Monthly Spending */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Spending</Text>
          <Text style={styles.cardAmount}>₹{Math.round(totalMonthlySpend)}</Text>
          <Text style={styles.cardSubText}>
            Across {subscriptions.length} active subscriptions
          </Text>
        </View>

        {/* Active Subscriptions */}
        <Text style={styles.sectionTitle}>Active Subscriptions</Text>
        {subscriptions.map((sub) => {
          const Icon = sub.icon;
          return (
            <View key={sub.id} style={styles.subCard}>
              <Image source={{ uri: sub.image }} style={styles.subImage} />
              <View style={styles.subInfo}>
                <View style={styles.subHeader}>
                  <Text style={styles.subName}>{sub.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.subCategory}>{sub.category}</Text>
                <Text style={styles.subRenew}>Renews on {sub.renewsOn}</Text>
              </View>
              <View style={styles.subRight}>
                <Text style={styles.subPrice}>₹{sub.price}</Text>
                <Text style={styles.subPeriod}>per {sub.period}</Text>
                <TouchableOpacity style={styles.manageButton}>
                  <Text style={styles.manageText}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Available Services */}
        <Text style={styles.sectionTitle}>Discover New Services</Text>
        {availableServices.map((service) => {
          const Icon = service.icon;
          return (
            <View key={service.id} style={[styles.subCard, styles.dashedBorder]}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: service.color },
                ]}
              >
                <Icon color={service.iconColor} size={24} />
              </View>
              <View style={styles.subInfo}>
                <View style={styles.subHeader}>
                  <Text style={styles.subName}>{service.name}</Text>
                  {service.offer && (
                    <View style={styles.offerBadge}>
                      <Text style={styles.offerText}>{service.offer}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.subCategory}>{service.category}</Text>
              </View>
              <View style={styles.subRight}>
                <Text style={styles.subPrice}>₹{service.price}</Text>
                <Text style={styles.subPeriod}>per {service.period}</Text>
                <TouchableOpacity style={styles.subscribeButton}>
                  <Text style={styles.subscribeText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: "#dbeafe" }]}>
              <Tv color="#2563eb" size={22} />
            </View>
            <Text style={styles.actionText}>Manage All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: "#dcfce7" }]}>
              <Crown color="#16a34a" size={22} />
            </View>
            <Text style={styles.actionText}>Upgrade Plans</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backButton: {
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 4,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, color: "#fff", height: 40 },
  body: { padding: 16 },
  card: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: { color: "#111827", fontWeight: "500", marginBottom: 4 },
  cardAmount: { fontSize: 24, fontWeight: "700", color: "#007bff" },
  cardSubText: { color: "#6b7280", fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  subImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  subInfo: { flex: 1 },
  subHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  subName: { fontWeight: "600", fontSize: 15 },
  badge: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: "#166534", fontSize: 11, fontWeight: "600" },
  subCategory: { fontSize: 13, color: "#6b7280" },
  subRenew: { fontSize: 12, color: "#9ca3af" },
  subRight: { alignItems: "flex-end" },
  subPrice: { fontWeight: "600" },
  subPeriod: { fontSize: 12, color: "#6b7280" },
  manageButton: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  manageText: { fontSize: 12, color: "#374151", fontWeight: "500" },
  dashedBorder: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  offerBadge: {
    backgroundColor: "#ffedd5",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  offerText: { color: "#ea580c", fontSize: 11, fontWeight: "600" },
  subscribeButton: {
    marginTop: 6,
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subscribeText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: { fontSize: 13, fontWeight: "500", color: "#111827" },
});
