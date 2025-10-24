import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Star,
  TrendingUp
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import RideCheckout from "./ride/RideCheckout";
import RideTracking from "./ride/RideTracking";

export default function RideScreen({ onNavigate }) {
  const [currentView, setCurrentView] = useState("booking");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);

  const rideTypes = [
    {
      id: "bike",
      name: "SuperBike",
      icon: "🏍️",
      capacity: "1 person",
      eta: "2 mins away",
      price: 45,
      description: "Affordable bike rides",
      discount: "20% OFF",
    },
    {
      id: "auto",
      name: "SuperAuto",
      icon: "🛺",
      capacity: "3 people",
      eta: "3 mins away",
      price: 85,
      description: "Comfortable auto rides",
    },
    {
      id: "mini",
      name: "SuperMini",
      icon: "🚗",
      capacity: "4 people",
      eta: "5 mins away",
      price: 125,
      description: "Compact AC cars",
      discount: "Free Wifi",
    },
    {
      id: "sedan",
      name: "SuperSedan",
      icon: "🚙",
      capacity: "4 people",
      eta: "6 mins away",
      price: 165,
      description: "Spacious sedans",
    },
    {
      id: "suv",
      name: "SuperSUV",
      icon: "🚐",
      capacity: "6 people",
      eta: "8 mins away",
      price: 245,
      description: "Premium SUVs",
      discount: "Extra Space",
    },
    {
      id: "share",
      name: "SuperShare",
      icon: "🚕",
      capacity: "Shared",
      eta: "10 mins away",
      price: 35,
      description: "Share & save money",
      discount: "50% Cheaper",
    },
  ];

  const savedPlaces = [
    { name: "Home", address: "Sector 18, Noida", icon: "🏠" },
    { name: "Office", address: "Connaught Place, Delhi", icon: "🏢" },
    { name: "Gym", address: "Hauz Khas, Delhi", icon: "💪" },
    { name: "Mall", address: "DLF Mall, Gurgaon", icon: "🛒" },
  ];

  const recentRides = [
    { from: "Sector 18, Noida", to: "Connaught Place, Delhi" },
    { from: "Home", to: "Airport Terminal 3" },
    { from: "DLF Cyber City", to: "Khan Market" },
  ];

  const handleRideSelect = (ride) => {
    if (!pickup || !destination) return;
    setSelectedRide(ride);
    setCurrentView("checkout");
  };

  const handleConfirmRide = () => setCurrentView("tracking");

  const handleBack = () => {
    if (currentView === "tracking") setCurrentView("checkout");
    else if (currentView === "checkout") {
      setCurrentView("booking");
      setSelectedRide(null);
    } else {
      onNavigate("home");
    }
  };

  const calculateDistance = () => "8.5 km";

  // ---- Checkout ----
  if (currentView === "checkout" && selectedRide) {
    return (
      <RideCheckout
        rideType={selectedRide}
        pickup={pickup}
        destination={destination}
        distance={calculateDistance()}
        onBack={handleBack}
        onConfirm={handleConfirmRide}
      />
    );
  }

  // ---- Tracking ----
  if (currentView === "tracking" && selectedRide) {
    return (
      <RideTracking
        rideType={selectedRide}
        pickup={pickup}
        destination={destination}
        finalTotal={finalTotal || selectedRide.price + 15}
        onBack={handleBack}
      />
    );
  }

  // ---- Booking Screen ----
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onNavigate("home")}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Book a Ride</Text>
            <Text style={styles.headerSubtitle}>Where do you want to go?</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.supportBtn}
          onPress={() => onNavigate("chat")}
        >
          <MessageCircle color="#fff" size={16} style={{ marginRight: 6 }} />
          <Text style={{ color: "#fff" }}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <View style={styles.greenDot} />
          <TextInput
            placeholder="Pickup location"
            style={styles.input}
            value={pickup}
            onChangeText={setPickup}
          />
        </View>
        <View style={styles.line} />
        <View style={styles.inputRow}>
          <View style={styles.blueDot} />
          <TextInput
            placeholder="Where to?"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Saved Places */}
        {!pickup && !destination && (
          <>
            <Text style={styles.sectionTitle}>SAVED PLACES</Text>
            {savedPlaces.map((place, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.icon}>{place.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{place.name}</Text>
                    <Text style={styles.cardSubtitle}>{place.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Recent Rides */}
        {!pickup && !destination && (
          <>
            <Text style={styles.sectionTitle}>RECENT RIDES</Text>
            {recentRides.map((ride, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => {
                  setPickup(ride.from);
                  setDestination(ride.to);
                }}
              >
                <View style={styles.row}>
                  <View style={styles.lineMarker}>
                    <View style={styles.greenDotSmall} />
                    <View style={styles.lineSmall} />
                    <View style={styles.blueDotSmall} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{ride.from}</Text>
                    <Text style={styles.cardSubtitle}>{ride.to}</Text>
                  </View>
                  <Clock color="#888" size={16} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Available Rides */}
        {pickup && destination && (
          <>
            <View style={styles.rowSpace}>
              <Text style={styles.sectionTitle}>CHOOSE A RIDE</Text>
              <View style={styles.badge}>
                <TrendingUp color="#007AFF" size={12} />
                <Text style={styles.badgeText}>{calculateDistance()}</Text>
              </View>
            </View>

            {rideTypes.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={styles.card}
                onPress={() => handleRideSelect(ride)}
              >
                <View style={styles.row}>
                  <Text style={styles.rideIcon}>{ride.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Text style={styles.cardTitle}>{ride.name}</Text>
                      {ride.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>{ride.discount}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardSubtitle}>{ride.description}</Text>
                    <View style={styles.rideMeta}>
                      <Clock color="#888" size={12} />
                      <Text style={styles.metaText}>{ride.eta}</Text>
                      <Text style={styles.metaText}>• {ride.capacity}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.price}>₹{ride.price}</Text>
                    <View style={styles.row}>
                      <Star color="#FFD700" fill="#FFD700" size={12} />
                      <Text style={styles.metaText}>
                        4.{Math.floor(Math.random() * 3) + 7}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Promo Banner */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>Ride & Earn Rewards!</Text>
            <Text style={styles.bannerText}>
              Complete 5 rides to unlock special offers
            </Text>
          </View>
          <Text style={styles.bannerIcon}>🎁</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "#fff", fontSize: 13, opacity: 0.9 },
  supportBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  inputCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "green" },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#007AFF" },
  line: {
    width: 1,
    height: 25,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginLeft: 8,
  },
  scroll: { flex: 1, paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 15,
    marginBottom: 6,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    elevation: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontWeight: "600", fontSize: 14 },
  cardSubtitle: { color: "#777", fontSize: 12 },
  icon: { fontSize: 20 },
  lineMarker: { alignItems: "center", marginRight: 8 },
  greenDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "green",
  },
  blueDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
  },
  lineSmall: { width: 1, height: 20, backgroundColor: "#ccc" },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "#007AFF", fontSize: 12, marginLeft: 4 },
  rideIcon: { fontSize: 28 },
  discountBadge: {
    backgroundColor: "#E6F9EC",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { color: "green", fontSize: 10 },
  rideMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: "#666" },
  price: { fontWeight: "600", fontSize: 16, color: "#111" },
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  bannerTitle: { color: "#fff", fontWeight: "600", fontSize: 15 },
  bannerText: { color: "#fff", opacity: 0.9, fontSize: 12 },
  bannerIcon: { fontSize: 30 },
});
