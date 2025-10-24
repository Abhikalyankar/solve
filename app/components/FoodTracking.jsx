import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { MotiView } from "moti";
import { ArrowLeft, MapPin } from "lucide-react-native";

export default function FoodTracking({ handleBack }) {
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== Simulate Delivery Boy Moving =====
  useEffect(() => {
    (async () => {
      // Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied for location tracking!");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Start delivery location slightly away
      let delivery = {
        latitude: latitude + 0.01,
        longitude: longitude - 0.01,
      };
      setDeliveryLocation(delivery);
      setLoading(false);

      // Simulate movement every 3 sec
      const interval = setInterval(() => {
        delivery = {
          latitude: delivery.latitude - 0.0005,
          longitude: delivery.longitude + 0.0005,
        };
        setDeliveryLocation({ ...delivery });
      }, 3000);

      return () => clearInterval(interval);
    })();
  }, []);

  if (loading || !userLocation || !deliveryLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading map...</Text>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Live Order Tracking</Text>
        </View>
      </MotiView>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* User Marker */}
        <Marker coordinate={userLocation} title="You" pinColor="blue" />

        {/* Delivery Boy Marker */}
        <Marker
          coordinate={deliveryLocation}
          title="Delivery Partner"
          pinColor="red"
        >
          <View style={styles.deliveryMarker}>
            <MapPin color="white" size={18} />
          </View>
        </Marker>

        {/* Route Line */}
        <Polyline
          coordinates={[userLocation, deliveryLocation]}
          strokeColor="#007bff"
          strokeWidth={3}
        />
      </MapView>

      {/* Delivery Status */}
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>🚴 Delivery Partner is on the way!</Text>
        <Text style={styles.subText}>Arriving soon at your location</Text>
      </View>
    </View>
  );
}

// ===== STYLES =====
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
  map: { flex: 1 },
  deliveryMarker: {
    backgroundColor: "#FF3B30",
    padding: 6,
    borderRadius: 50,
  },
  statusBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: { fontSize: 16, fontWeight: "600", color: "#007bff" },
  subText: { fontSize: 13, color: "#666", marginTop: 4 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
