import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
} from "lucide-react-native";

export default function OrdersScreen({ onNavigate }) {
  const [tab, setTab] = useState("active");

  const activeOrders = [
    {
      id: "ORD001",
      type: "food",
      restaurant: "Burger King",
      items: "Whopper Meal + 2 Items",
      status: "preparing",
      estimatedTime: "25-30 mins",
      amount: 299,
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop",
    },
    {
      id: "ORD002",
      type: "grocery",
      store: "BigBasket",
      items: "Vegetables & Fruits",
      status: "packed",
      estimatedTime: "2-3 hours",
      amount: 845,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
    },
    {
      id: "ORD003",
      type: "medicine",
      pharmacy: "Apollo Pharmacy",
      items: "Paracetamol & 3 Items",
      status: "out_for_delivery",
      estimatedTime: "45 mins",
      amount: 156,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    },
  ];

  const pastOrders = [
    {
      id: "ORD004",
      type: "ride",
      service: "Uber",
      route: "Home to Office",
      completedAt: "2 hours ago",
      amount: 180,
    },
    {
      id: "ORD005",
      type: "food",
      restaurant: "Dominos",
      items: "Margherita Pizza",
      completedAt: "Yesterday",
      amount: 399,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "preparing":
        return { bg: "#fef9c3", text: "#854d0e" };
      case "packed":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "out_for_delivery":
        return { bg: "#dcfce7", text: "#166534" };
      default:
        return { bg: "#f3f4f6", text: "#1f2937" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "preparing":
        return "Preparing";
      case "packed":
        return "Packed";
      case "out_for_delivery":
        return "Out for Delivery";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate("home")}
          style={styles.iconButton}
        >
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "active" && styles.activeTab]}
          onPress={() => setTab("active")}
        >
          <Text
            style={[styles.tabText, tab === "active" && styles.activeTabText]}
          >
            Active Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "past" && styles.activeTab]}
          onPress={() => setTab("past")}
        >
          <Text
            style={[styles.tabText, tab === "past" && styles.activeTabText]}
          >
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Active Orders */}
        {tab === "active" &&
          (activeOrders.length > 0 ? (
            activeOrders.map((order) => {
              const color = getStatusColor(order.status);
              return (
                <View key={order.id} style={styles.card}>
                  <View style={styles.orderRow}>
                    <Image
                      source={{ uri: order.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.title}>
                            {order.restaurant ||
                              order.store ||
                              order.pharmacy}
                          </Text>
                          <Text style={styles.subtitle}>{order.items}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: color.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: color.text },
                            ]}
                          >
                            {getStatusText(order.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rowBetween}>
                        <View style={styles.timeRow}>
                          <Clock color="#6b7280" size={14} />
                          <Text style={styles.timeText}>
                            {order.estimatedTime}
                          </Text>
                        </View>
                        <Text style={styles.amount}>₹{order.amount}</Text>
                      </View>

                      <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.trackButton}>
                          <MapPin color="#007bff" size={16} />
                          <Text style={styles.trackText}>Track</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callButton}>
                          <Phone color="#007bff" size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Package color="#9ca3af" size={60} />
              <Text style={styles.emptyTitle}>No Active Orders</Text>
              <Text style={styles.emptySubtitle}>
                When you place orders, they'll appear here
              </Text>
            </View>
          ))}

        {/* Past Orders */}
        {tab === "past" &&
          pastOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.title}>
                    {order.restaurant || order.service}
                  </Text>
                  <Text style={styles.subtitle}>
                    {order.items || order.route}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.amount}>₹{order.amount}</Text>
                  <Text style={styles.subtitle}>{order.completedAt}</Text>
                </View>
              </View>

              <View style={styles.pastRow}>
                <View style={styles.deliveredRow}>
                  <CheckCircle color="#16a34a" size={16} />
                  <Text style={styles.deliveredText}>Delivered</Text>
                </View>
                <View style={styles.pastButtons}>
                  <TouchableOpacity style={styles.reorderButton}>
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reorderButton}>
                    <Text style={styles.reorderText}>Rate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 16,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: { color: "#6b7280", fontWeight: "500" },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  activeTabText: { color: "#007bff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    elevation: 1,
  },
  orderRow: { flexDirection: "row" },
  image: { width: 80, height: 80, borderRadius: 8 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontWeight: "600", fontSize: 15, color: "#111827" },
  subtitle: { color: "#6b7280", fontSize: 13 },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: { fontSize: 12, fontWeight: "500" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { color: "#6b7280", fontSize: 13 },
  amount: { fontWeight: "600", color: "#111827" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  trackButton: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  trackText: { color: "#007bff", marginLeft: 6, fontWeight: "500" },
  callButton: {
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    width: 40,
  },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyTitle: { fontWeight: "600", fontSize: 16, marginTop: 10 },
  emptySubtitle: { color: "#6b7280", fontSize: 13, textAlign: "center" },
  pastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  deliveredRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  deliveredText: { color: "#16a34a", fontSize: 13, fontWeight: "500" },
  pastButtons: { flexDirection: "row", gap: 8 },
  reorderButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  reorderText: { color: "#374151", fontWeight: "500" },
});