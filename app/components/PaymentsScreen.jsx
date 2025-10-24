import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  QrCode,
  Send,
  Download,
  CreditCard,
  Smartphone,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react-native";

export default function PaymentsScreen({ onNavigate }) {
  const [showBalance, setShowBalance] = useState(false);
  const [tab, setTab] = useState("send");
  const [amount, setAmount] = useState("");

  const quickAmounts = ["100", "200", "500", "1000"];

  const recentTransactions = [
    { id: "1", type: "sent", amount: 150, name: "Priya Sharma", time: "2 hours ago" },
    { id: "2", type: "received", amount: 300, name: "Amit Kumar", time: "5 hours ago" },
    { id: "3", type: "bill", amount: 1200, name: "Electricity Bill", time: "Yesterday" },
    { id: "4", type: "recharge", amount: 199, name: "Mobile Recharge", time: "2 days ago" },
  ];

  const billCategories = [
    { icon: Zap, label: "Electricity", color: "#fef9c3", iconColor: "#eab308" },
    { icon: Smartphone, label: "Mobile", color: "#dbeafe", iconColor: "#2563eb" },
    { icon: CreditCard, label: "Credit Card", color: "#f3e8ff", iconColor: "#9333ea" },
  ];

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
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Wallet */}
      <View style={styles.walletCard}>
        <View style={styles.walletRow}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.walletAmount}>
                {showBalance ? "₹2,450.00" : "₹••••••"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                style={{ marginLeft: 8 }}
              >
                {showBalance ? (
                  <EyeOff color="#007bff" size={18} />
                ) : (
                  <Eye color="#007bff" size={18} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["send", "bills", "history"].map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabButton, tab === t && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === t && styles.activeText]}>
              {t === "send" ? "Send" : t === "bills" ? "Bills" : "History"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ==== SEND TAB ==== */}
        {tab === "send" && (
          <>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionCard}>
                <QrCode color="#007bff" size={28} />
                <Text style={styles.actionLabel}>Scan QR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Smartphone color="#007bff" size={28} />
                <Text style={styles.actionLabel}>To Mobile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Send Money</Text>
              <TextInput
                placeholder="Enter UPI ID or Mobile Number"
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                placeholder="Enter amount"
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <View style={styles.quickRow}>
                {quickAmounts.map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.quickButton}
                    onPress={() => setAmount(amt)}
                  >
                    <Text style={styles.quickText}>₹{amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Add a note (optional)"
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />

              <TouchableOpacity
                style={[styles.sendButton, !amount && { opacity: 0.5 }]}
                disabled={!amount}
              >
                <Send color="#fff" size={16} style={{ marginRight: 8 }} />
                <Text style={styles.sendText}>Send Money</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ==== BILLS TAB ==== */}
        {tab === "bills" && (
          <>
            <View style={styles.billRow}>
              {billCategories.map((b, i) => {
                const Icon = b.icon;
                return (
                  <TouchableOpacity key={i} style={styles.billCard}>
                    <View
                      style={[
                        styles.billIconBox,
                        { backgroundColor: b.color },
                      ]}
                    >
                      <Icon color={b.iconColor} size={24} />
                    </View>
                    <Text style={styles.billLabel}>{b.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Bills</Text>
              <View style={styles.billItem}>
                <View>
                  <Text style={styles.billName}>Electricity Bill</Text>
                  <Text style={styles.billDate}>Due: Mar 15</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.billAmount}>₹1,240</Text>
                  <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payText}>Pay Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.billItem}>
                <View>
                  <Text style={styles.billName}>Internet Bill</Text>
                  <Text style={styles.billDate}>Due: Mar 20</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.billAmount}>₹899</Text>
                  <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payText}>Pay Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ==== HISTORY TAB ==== */}
        {tab === "history" &&
          recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.txIconBox,
                    {
                      backgroundColor:
                        tx.type === "sent"
                          ? "#fee2e2"
                          : tx.type === "received"
                          ? "#dcfce7"
                          : "#dbeafe",
                    },
                  ]}
                >
                  {tx.type === "sent" ? (
                    <Send color="#dc2626" size={16} />
                  ) : tx.type === "received" ? (
                    <Download color="#16a34a" size={16} />
                  ) : (
                    <CreditCard color="#2563eb" size={16} />
                  )}
                </View>
                <View>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.txAmount,
                    {
                      color:
                        tx.type === "sent" ? "#dc2626" : "#16a34a",
                    },
                  ]}
                >
                  {tx.type === "sent" ? "-" : "+"}₹{tx.amount}
                </Text>
                <Text style={styles.txStatus}>Success</Text>
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
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  walletCard: {
    backgroundColor: "#007bff",
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  walletRow: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletLabel: { color: "#fff", opacity: 0.8, fontSize: 13 },
  walletAmount: { color: "#fff", fontSize: 22, fontWeight: "700" },
  balanceRow: { flexDirection: "row", alignItems: "center" },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addText: { color: "#007bff", fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabText: { color: "#6b7280", fontWeight: "500" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#007bff" },
  activeText: { color: "#007bff", fontWeight: "600" },

  actionRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 16,
    elevation: 1,
  },
  actionLabel: { color: "#111827", marginTop: 6, fontSize: 13 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: { fontWeight: "600", fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#111827",
  },
  quickRow: { flexDirection: "row", gap: 6 },
  quickButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  quickText: { color: "#111827", fontSize: 13 },

  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "600" },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  billCard: { flex: 1, alignItems: "center" },
  billIconBox: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  billLabel: { fontSize: 13, color: "#111827" },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  billName: { fontWeight: "500" },
  billDate: { color: "#6b7280", fontSize: 12 },
  billAmount: { fontWeight: "600", color: "#111827" },
  payButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  payText: { color: "#fff", fontSize: 12 },

  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    elevation: 1,
  },
  transactionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  txIconBox: {
    borderRadius: 8,
    padding: 8,
  },
  txName: { fontWeight: "500", color: "#111827" },
  txTime: { color: "#6b7280", fontSize: 12 },
  txAmount: { fontWeight: "700", fontSize: 14 },
  txStatus: { fontSize: 11, color: "#16a34a" },
});
