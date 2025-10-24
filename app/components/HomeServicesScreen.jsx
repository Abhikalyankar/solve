import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Shield,
} from "lucide-react-native";

export default function HomeServicesScreen({ onNavigate }) {
  const services = [
    {
      id: "electrician",
      name: "Electrician",
      icon: Zap,
      price: "₹199 onwards",
      rating: 4.5,
      color: "#fef9c3",
      iconColor: "#ca8a04",
    },
    {
      id: "plumber",
      name: "Plumber",
      icon: Droplets,
      price: "₹179 onwards",
      rating: 4.3,
      color: "#dbeafe",
      iconColor: "#2563eb",
    },
    {
      id: "ac-repair",
      name: "AC Repair",
      icon: Wind,
      price: "₹299 onwards",
      rating: 4.4,
      color: "#cffafe",
      iconColor: "#06b6d4",
    },
    {
      id: "carpenter",
      name: "Carpenter",
      icon: Wrench,
      price: "₹249 onwards",
      rating: 4.2,
      color: "#ffedd5",
      iconColor: "#ea580c",
    },
    {
      id: "painter",
      name: "Painter",
      icon: Paintbrush,
      price: "₹399 onwards",
      rating: 4.6,
      color: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      price: "₹500 onwards",
      rating: 4.7,
      color: "#f3e8ff",
      iconColor: "#7e22ce",
    },
  ];

  const timeSlots = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => onNavigate("home")}
            style={styles.iconButton}
          >
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home Services</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Services */}
        <View style={styles.emergencyCard}>
          <Shield color="#dc2626" size={24} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.emergencyTitle}>Emergency Services</Text>
            <Text style={styles.emergencyText}>
              Available 24/7 for urgent repairs
            </Text>
          </View>
          <TouchableOpacity style={styles.callNowButton}>
            <Text style={styles.callNowText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Services */}
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <View style={styles.grid}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <View key={service.id} style={styles.card}>
                <View
                  style={[
                    styles.serviceIconBox,
                    { backgroundColor: service.color },
                  ]}
                >
                  <Icon color={service.iconColor} size={26} />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <View style={styles.serviceRow}>
                  <Text style={styles.rating}>⭐ {service.rating}</Text>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Today's Slots */}
        <Text style={styles.sectionTitle}>Today's Available Slots</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slotRow}
        >
          {timeSlots.map((slot, index) => (
            <TouchableOpacity key={index} style={styles.slotButton}>
              <Text style={styles.slotText}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Bookings */}
        <Text style={styles.sectionTitle}>Recent Bookings</Text>

        <View style={styles.recentCard}>
          <View style={styles.recentRow}>
            <View style={styles.recentIconBoxBlue}>
              <Droplets color="#2563eb" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>Plumber Service</Text>
              <Text style={styles.recentSub}>Completed • 2 days ago</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.recentAmount}>₹280</Text>
              <TouchableOpacity style={styles.rebookButton}>
                <Text style={styles.rebookText}>Rebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.recentCard}>
          <View style={styles.recentRow}>
            <View style={styles.recentIconBoxYellow}>
              <Zap color="#ca8a04" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>Electrician</Text>
              <Text style={styles.recentSub}>Completed • 1 week ago</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.recentAmount}>₹350</Text>
              <TouchableOpacity style={styles.rebookButton}>
                <Text style={styles.rebookText}>Rebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  searchBox: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingLeft: 36,
    height: 42,
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: { color: "#fff", fontSize: 14, flex: 1 },

  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  emergencyTitle: { fontWeight: "600", color: "#991b1b" },
  emergencyText: { color: "#b91c1c", fontSize: 13 },
  callNowButton: {
    backgroundColor: "#dc2626",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  callNowText: { color: "#fff", fontWeight: "600" },

  sectionTitle: { fontWeight: "600", fontSize: 16, marginBottom: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    width: "48%",
    marginBottom: 12,
    elevation: 1,
  },
  serviceIconBox: {
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    width: 45,
    height: 45,
  },
  serviceName: { fontWeight: "600", color: "#111827" },
  servicePrice: { color: "#6b7280", fontSize: 13, marginBottom: 4 },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: { fontSize: 12, color: "#374151" },
  bookButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  bookText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  slotRow: { flexDirection: "row", gap: 10 },
  slotButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  slotText: { color: "#111827", fontSize: 13 },

  recentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  recentRow: { flexDirection: "row", alignItems: "center" },
  recentIconBoxBlue: {
    backgroundColor: "#dbeafe",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  recentIconBoxYellow: {
    backgroundColor: "#fef9c3",
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  recentTitle: { fontWeight: "600", color: "#111827" },
  recentSub: { color: "#6b7280", fontSize: 13 },
  recentAmount: { fontWeight: "600", color: "#111827" },
  rebookButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  rebookText: { color: "#111827", fontSize: 12, fontWeight: "500" },
});
