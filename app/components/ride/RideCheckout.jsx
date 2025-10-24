import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  Tag,
  CreditCard,
  Wallet as WalletIcon,
  X,
  ChevronRight,
} from "lucide-react-native";

export default function RideCheckout({
  rideType,
  pickup,
  destination,
  distance,
  onBack,
  onConfirm,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("wallet");

  const availableCoupons = [
    { code: "RIDE50", discount: 50, minFare: 150, description: "₹50 OFF on rides above ₹150" },
    { code: "FIRST100", discount: 100, minFare: 200, description: "₹100 OFF on rides above ₹200" },
    { code: "SAVE30", discount: 30, minFare: 100, description: "₹30 OFF on rides above ₹100" },
  ];

  const paymentMethods = [
    { id: "wallet", name: "SuperApp Wallet", icon: WalletIcon, balance: 2450 },
    { id: "upi", name: "UPI", icon: CreditCard },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "cash", name: "Cash", icon: WalletIcon },
  ];

  const applyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase());
    if (coupon && rideType.price >= coupon.minFare) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
      setCouponCode("");
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const platformFee = 10;
  const gst = Math.round((rideType.price + platformFee) * 0.05);
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = rideType.price + platformFee + gst - discount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Confirm Ride</Text>
          <Text style={styles.headerSubtitle}>{rideType.name}</Text>
        </View>
      </View>

      {/* Scrollable Section */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Trip Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.tripSection}>
            <View style={styles.line}>
              <View style={styles.greenDot}></View>
              <View style={styles.lineConnector}></View>
              <View style={styles.blueDot}></View>
            </View>
            <View style={styles.tripInfo}>
              <View>
                <Text style={styles.label}>Pickup</Text>
                <Text style={styles.value}>{pickup}</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{destination}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.rowLeft}>
              <MapPin color="#555" size={16} />
              <Text style={styles.label}>Distance</Text>
            </View>
            <Text style={styles.value}>{distance}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.rowLeft}>
              <Clock color="#555" size={16} />
              <Text style={styles.label}>ETA</Text>
            </View>
            <Text style={styles.value}>{rideType.eta}</Text>
          </View>
        </View>

        {/* Ride Type */}
        <View style={styles.card}>
          <View style={styles.rowSpace}>
            <View>
              <Text style={styles.value}>{rideType.name}</Text>
              <Text style={styles.label}>{rideType.description}</Text>
              <Text style={styles.label}>{rideType.capacity}</Text>
            </View>
            <TouchableOpacity onPress={onBack} style={styles.changeButton}>
              <Text style={{ color: "#007AFF" }}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coupon */}
        <View style={styles.card}>
          <View style={styles.rowLeft}>
            <Tag color="green" size={18} />
            <Text style={[styles.value, { marginLeft: 8 }]}>Apply Coupon</Text>
          </View>

          {appliedCoupon ? (
            <View style={[styles.couponBox, { backgroundColor: "#E6F9EC" }]}>
              <View style={styles.rowSpace}>
                <View>
                  <Text style={{ fontWeight: "600", color: "green" }}>
                    {appliedCoupon.code}
                  </Text>
                  <Text style={{ fontSize: 12, color: "green" }}>
                    You saved ₹{appliedCoupon.discount}!
                  </Text>
                </View>
                <TouchableOpacity onPress={removeCoupon}>
                  <X color="green" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.rowSpace}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                />
                <TouchableOpacity
                  onPress={applyCoupon}
                  disabled={!couponCode}
                  style={[styles.applyBtn, !couponCode && { opacity: 0.5 }]}
                >
                  <Text style={{ color: "#fff" }}>Apply</Text>
                </TouchableOpacity>
              </View>

              {availableCoupons.map((coupon) => (
                <TouchableOpacity
                  key={coupon.code}
                  style={[
                    styles.couponBox,
                    rideType.price < coupon.minFare && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    if (rideType.price >= coupon.minFare) setCouponCode(coupon.code);
                  }}
                >
                  <View style={styles.rowSpace}>
                    <View>
                      <Text style={{ fontWeight: "600" }}>{coupon.code}</Text>
                      <Text style={styles.label}>{coupon.description}</Text>
                    </View>
                    <ChevronRight color="#999" size={16} />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.rowLeft}>
            <CreditCard color="#007AFF" size={18} />
            <Text style={[styles.value, { marginLeft: 8 }]}>Payment Method</Text>
          </View>

          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const selected = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedPayment(method.id)}
                style={[
                  styles.paymentBox,
                  selected && { borderColor: "#007AFF", backgroundColor: "#E8F0FE" },
                ]}
              >
                <View style={styles.rowLeft}>
                  <View
                    style={[
                      styles.radioOuter,
                      selected && { borderColor: "#007AFF" },
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Icon color="#444" size={18} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.value}>{method.name}</Text>
                    {method.balance && (
                      <Text style={styles.label}>Balance: ₹{method.balance}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fare Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fare Breakdown</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Base Fare</Text>
            <Text style={styles.value}>₹{rideType.price}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Platform Fee</Text>
            <Text style={styles.value}>₹{platformFee}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>GST (5%)</Text>
            <Text style={styles.value}>₹{gst}</Text>
          </View>
          {appliedCoupon && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: "green" }]}>Coupon Discount</Text>
              <Text style={[styles.value, { color: "green" }]}>
                -₹{appliedCoupon.discount}
              </Text>
            </View>
          )}
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <Text style={[styles.value, { fontWeight: "600" }]}>Total Fare</Text>
            <Text style={[styles.value, { fontWeight: "700", fontSize: 16 }]}>
              ₹{finalTotal}
            </Text>
          </View>
        </View>

        {/* Safety */}
        <View style={[styles.card, { backgroundColor: "#EAF3FF", borderColor: "#C7DCFF" }]}>
          <View style={styles.rowLeft}>
            <Shield color="#007AFF" size={18} />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontWeight: "600", color: "#0056D2" }}>Safety First</Text>
              <Text style={{ fontSize: 12, color: "#0056D2" }}>
                Share trip details with family & friends
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm & Book Ride</Text>
          <Text style={styles.confirmPrice}>₹{finalTotal}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { color: "#fff", fontSize: 13, opacity: 0.9 },
  scrollContainer: { flex: 1, padding: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: "600", marginBottom: 10, fontSize: 15 },
  line: { flexDirection: "column", alignItems: "center", marginRight: 10 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "green" },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#007AFF" },
  lineConnector: { width: 2, height: 30, backgroundColor: "#ccc", marginVertical: 2 },
  tripSection: { flexDirection: "row" },
  tripInfo: { flex: 1 },
  label: { fontSize: 12, color: "#777" },
  value: { fontSize: 14, color: "#111" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowSpace: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
  changeButton: { padding: 6, borderWidth: 1, borderColor: "#007AFF", borderRadius: 6 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, flex: 1 },
  applyBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginLeft: 8,
  },
  couponBox: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginVertical: 5 },
  paymentBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginVertical: 5 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  footer: { padding: 10, borderTopWidth: 1, borderTopColor: "#eee", backgroundColor: "#fff" },
  confirmBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  confirmText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  confirmPrice: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
