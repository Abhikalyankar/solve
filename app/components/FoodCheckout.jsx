import { ArrowLeft, ChevronRight, Percent, X } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function FoodCheckout({
  selectedRestaurant,
  cart,
  handleBack,
  getCartTotal,
  getFinalTotal,
  applyCoupon,
  removeCoupon,
  couponCode,
  setCouponCode,
  appliedCoupon,
  handlePlaceOrder,
}) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Review Order</Text>
            <Text style={styles.headerSubtitle}>{selectedRestaurant.name}</Text>
          </View>
        </View>
      </MotiView>

      {/* Checkout Scroll Area */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Bill Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Item Total</Text>
            <Text style={styles.value}>₹{getCartTotal()}</Text>
          </View>

          {appliedCoupon && (
            <View style={[styles.rowBetween, { marginTop: 4 }]}>
              <Text style={[styles.label, { color: "green" }]}>
                Discount ({appliedCoupon.code})
              </Text>
              <Text style={[styles.value, { color: "green" }]}>
                -₹{appliedCoupon.discount}
              </Text>
            </View>
          )}

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{getFinalTotal()}</Text>
          </View>
        </View>

        {/* Coupon Section */}
        <View style={styles.card}>
          <View style={styles.couponHeader}>
            <Percent size={16} color="green" />
            <Text style={styles.couponTitle}>Apply Coupon</Text>
          </View>

          {appliedCoupon ? (
            <View style={styles.appliedCouponBox}>
              <Text style={styles.appliedCouponText}>
                {appliedCoupon.code} - ₹{appliedCoupon.discount} OFF
              </Text>
              <TouchableOpacity onPress={removeCoupon} style={styles.removeBtn}>
                <X color="green" size={18} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponRow}>
              <TextInput
                value={couponCode}
                onChangeText={(text) => setCouponCode(text.toUpperCase())}
                placeholder="Enter coupon"
                placeholderTextColor="#999"
                style={styles.input}
              />
              <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.9}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <View style={styles.footerRight}>
            <Text style={styles.footerTotal}>₹{getFinalTotal()}</Text>
            <ChevronRight color="#fff" size={18} />
          </View>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  header: { backgroundColor: "#007bff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "#e0e0e0", fontSize: 13 },

  scroll: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, color: "#111" },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  totalLabel: { fontSize: 15, fontWeight: "600", color: "#333" },
  totalValue: { fontSize: 15, fontWeight: "700", color: "#111" },

  couponHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  couponTitle: { fontWeight: "600", color: "#222", fontSize: 14, marginTop: 2 },

  couponRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
  },
  applyBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  applyText: { color: "#fff", fontWeight: "500" },

  appliedCouponBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E6F4EA",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  appliedCouponText: { color: "green", fontWeight: "500" },
  removeBtn: { padding: 4 },

  footer: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  placeOrderButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerTotal: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
