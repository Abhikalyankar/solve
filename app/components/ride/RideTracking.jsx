import {
    ArrowLeft,
    ChevronRight,
    MessageCircle,
    Phone,
    Shield,
    Star
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function RideTracking({
  rideType,
  pickup,
  destination,
  finalTotal,
  onBack,
}) {
  const [driverProgress, setDriverProgress] = useState(0);
  const [rideStatus, setRideStatus] = useState("searching");

  useEffect(() => {
    const statusTimeline = [
      { status: "searching", delay: 0 },
      { status: "driver_assigned", delay: 3000 },
      { status: "arriving", delay: 6000 },
      { status: "started", delay: 12000 },
      { status: "completed", delay: 20000 },
    ];

    statusTimeline.forEach(({ status, delay }) => {
      setTimeout(() => setRideStatus(status), delay);
    });

    const interval = setInterval(() => {
      setDriverProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const driverInfo = {
    name: "Rajesh Kumar",
    rating: 4.8,
    totalRides: 1247,
    vehicleNumber: "DL 01 AB 1234",
    vehicleModel: "Honda City",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  };

  const getStatusMessage = () => {
    switch (rideStatus) {
      case "searching":
        return "Searching for nearby drivers...";
      case "driver_assigned":
        return "Driver assigned! Arriving in 5 mins";
      case "arriving":
        return "Driver is arriving at pickup location";
      case "started":
        return "Trip in progress";
      case "completed":
        return "Trip completed!";
      default:
        return "";
    }
  };

  const progressSteps = [
    { label: "Driver Assigned", key: "driver_assigned" },
    { label: "Driver Arriving", key: "arriving" },
    { label: "Trip Started", key: "started" },
    { label: "Destination Reached", key: "completed" },
  ];

  const statusIndex = progressSteps.findIndex((s) => s.key === rideStatus);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Track Ride</Text>
          <Text style={styles.headerSubtitle}>
            Booking ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.pickupMarker}>
          <View style={[styles.markerDot, { backgroundColor: "green" }]} />
          <Text style={styles.markerLabel}>Pickup</Text>
        </View>
        <View style={styles.destMarker}>
          <View style={[styles.markerDot, { backgroundColor: "#007AFF" }]} />
          <Text style={styles.markerLabel}>Destination</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
        </View>
      </View>

      {/* Scroll Section */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Searching */}
        {rideStatus === "searching" && (
          <View style={styles.card}>
            <View style={{ alignItems: "center", padding: 20 }}>
              <View style={styles.spinner} />
              <Text style={styles.title}>Finding you the best driver</Text>
              <Text style={styles.subtitle}>This wont take long...</Text>
            </View>
          </View>
        )}

        {/* Driver Info */}
        {rideStatus !== "searching" && (
          <View style={styles.card}>
            <View style={styles.driverInfoRow}>
              <Image source={{ uri: driverInfo.photo }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{driverInfo.name}</Text>
                <View style={styles.ratingRow}>
                  <Star color="#FFD700" fill="#FFD700" size={16} />
                  <Text style={styles.rating}>{driverInfo.rating}</Text>
                  <Text style={styles.subText}>
                    • {driverInfo.totalRides} trips
                  </Text>
                </View>
                <Text style={styles.subText}>{driverInfo.vehicleModel}</Text>
                <Text style={styles.plate}>{driverInfo.vehicleNumber}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.actionBtn}>
                  <Phone color="#007AFF" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <MessageCircle color="#007AFF" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Progress Steps */}
        {rideStatus !== "searching" && (
          <View style={styles.card}>
            <Text style={styles.title}>Ride Progress</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(driverProgress, 100)}%` },
                ]}
              />
            </View>
            {progressSteps.map((step, index) => {
              const completed = index <= statusIndex;
              return (
                <View key={index} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepCircle,
                      completed
                        ? { backgroundColor: "green" }
                        : { backgroundColor: "#ddd" },
                    ]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      {completed ? "✓" : index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      completed ? { color: "#000" } : { color: "#888" },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {completed && index < progressSteps.length - 1 && (
                    <ChevronRight color="green" size={16} />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Trip Details */}
        <View style={styles.card}>
          <Text style={styles.title}>Trip Details</Text>
          <View style={styles.tripPoint}>
            <View style={styles.dotGreen} />
            <View>
              <Text style={styles.label}>Pickup</Text>
              <Text style={styles.value}>{pickup}</Text>
            </View>
          </View>
          <View style={styles.tripConnector} />
          <View style={styles.tripPoint}>
            <View style={styles.dotBlue} />
            <View>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>{destination}</Text>
            </View>
          </View>
        </View>

        {/* Fare Info */}
        <View style={styles.card}>
          <View style={styles.rowSpace}>
            <View>
              <Text style={styles.label}>Total Fare</Text>
              <Text style={styles.fare}>₹{finalTotal}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Prepaid</Text>
            </View>
          </View>
        </View>

        {/* Safety */}
        <View
          style={[
            styles.card,
            { backgroundColor: "#EAF3FF", borderColor: "#C7DCFF" },
          ]}
        >
          <View style={styles.rowLeft}>
            <Shield color="#007AFF" size={20} />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ color: "#0056D2", fontWeight: "600" }}>
                Safety Features Active
              </Text>
              <Text style={{ fontSize: 12, color: "#0056D2" }}>
                • Emergency SOS • Trip sharing • Live tracking
              </Text>
            </View>
          </View>
        </View>

        {/* Completed */}
        {rideStatus === "completed" && (
          <View style={[styles.card, { backgroundColor: "#E6F9EC" }]}>
            <View style={{ alignItems: "center", padding: 20 }}>
              <Text style={{ fontSize: 40, color: "green" }}>✓</Text>
              <Text style={[styles.title, { color: "green" }]}>
                Trip Completed!
              </Text>
              <Text style={{ color: "green", fontSize: 13 }}>
                Hope you had a comfortable ride
              </Text>
              <View style={styles.rowSpace}>
                <TouchableOpacity style={styles.rateBtn}>
                  <Text style={{ color: "#007AFF" }}>Rate Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Text style={{ color: "#fff" }}>Download Invoice</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
  },
  headerTitle: { color: "#fff", fontWeight: "600", fontSize: 18 },
  headerSubtitle: { color: "#fff", fontSize: 13, opacity: 0.9 },
  mapContainer: {
    height: 200,
    backgroundColor: "#EAF3FF",
    position: "relative",
    marginBottom: 10,
  },
  pickupMarker: { position: "absolute", top: 40, left: 40, alignItems: "center" },
  destMarker: { position: "absolute", bottom: 40, right: 40, alignItems: "center" },
  markerDot: { width: 16, height: 16, borderRadius: 8 },
  markerLabel: { backgroundColor: "#fff", padding: 4, borderRadius: 6, marginTop: 5 },
  statusBadge: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 3,
  },
  statusText: { color: "#007AFF", fontWeight: "500", fontSize: 13 },
  scrollContainer: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 15,
    marginBottom: 10,
  },
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 5,
    borderColor: "#007AFF",
    borderTopColor: "transparent",
    borderRadius: 30,
  },
  title: { fontWeight: "600", fontSize: 15, marginTop: 10 },
  subtitle: { color: "#777", fontSize: 13 },
  driverInfoRow: { flexDirection: "row", gap: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  driverName: { fontWeight: "600", fontSize: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 13 },
  subText: { color: "#666", fontSize: 12 },
  plate: { fontWeight: "500", color: "#111", fontSize: 13 },
  actionBtn: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 25,
    padding: 6,
    alignItems: "center",
    marginVertical: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  stepLabel: { fontSize: 14, flex: 1 },
  tripPoint: { flexDirection: "row", alignItems: "center", gap: 10 },
  tripConnector: { width: 2, height: 30, backgroundColor: "#ccc", marginLeft: 7 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: "green" },
  dotBlue: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#007AFF" },
  label: { color: "#777", fontSize: 12 },
  value: { fontSize: 14, color: "#111" },
  fare: { fontWeight: "600", fontSize: 18 },
  badge: {
    backgroundColor: "#E6F9EC",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeText: { color: "green", fontWeight: "600" },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rateBtn: {
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  downloadBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
