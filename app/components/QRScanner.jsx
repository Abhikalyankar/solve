import {
  CheckCircle,
  CreditCard,
  FileText,
  Gift,
  QrCode,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QRScanner({ onClose }) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanType, setScanType] = useState(null);
  const scanAnim = new Animated.Value(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanningProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            const types = ["payment", "offer", "menu"];
            const randomType = types[Math.floor(Math.random() * types.length)];
            setScanType(randomType);

            if (randomType === "payment")
              setScannedResult("upi://pay?merchant@upi");
            else if (randomType === "offer")
              setScannedResult("offer://discount?code=SAVE50");
            else setScannedResult("menu://restaurant?id=12345");

            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const renderResultCard = () => {
    switch (scanType) {
      case "payment":
        return (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#dcfce7" }]}>
                <CreditCard color="#16a34a" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>Payment Request</Text>
                <Text style={styles.resultSub}>Test Merchant</Text>
              </View>
              <CheckCircle color="#16a34a" size={22} />
            </View>

            <View style={styles.paymentBox}>
              <Text>Amount:</Text>
              <Text style={styles.amount}>₹150.00</Text>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.button, { flex: 1 }]}>
                <Text style={styles.buttonText}>Pay Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={() => {
                  setScannedResult(null);
                  setIsScanning(true);
                  setScanningProgress(0);
                }}
              >
                <Text style={styles.outlineText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "offer":
        return (
          <View style={[styles.resultCard, { backgroundColor: "#ecfdf5" }]}>
            <View style={styles.resultHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#22c55e" }]}>
                <Gift color="#fff" size={24} />
              </View>
              <View>
                <Text style={[styles.resultTitle, { color: "#15803d" }]}>
                  Special Offer!
                </Text>
                <Text style={[styles.resultSub, { color: "#16a34a" }]}>
                  Food Palace
                </Text>
              </View>
            </View>
            <View style={styles.offerBox}>
              <Text style={styles.offerText}>50% OFF</Text>
              <Text style={styles.offerSub}>on your next order</Text>
              <Text style={styles.offerCode}>Code: SAVE50</Text>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#16a34a", flex: 1 }]}
              >
                <Text style={styles.buttonText}>Claim Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={() => {
                  setScannedResult(null);
                  setIsScanning(true);
                  setScanningProgress(0);
                }}
              >
                <Text style={styles.outlineText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "menu":
        return (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#ffedd5" }]}>
                <FileText color="#ea580c" size={24} />
              </View>
              <View>
                <Text style={styles.resultTitle}>Digital Menu</Text>
                <Text style={styles.resultSub}>Pizza Corner</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.menuText}>
                🍕 View menu, place orders, and get discounts!
              </Text>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ea580c", flex: 1 }]}
              >
                <Text style={styles.buttonText}>View Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineButton, { flex: 1 }]}
                onPress={() => {
                  setScannedResult(null);
                  setIsScanning(true);
                  setScanningProgress(0);
                }}
              >
                <Text style={styles.outlineText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan QR Code</Text>
        <TouchableOpacity onPress={onClose}>
          <X color="#fff" size={26} />
        </TouchableOpacity>
      </View>

      {/* Camera Box Simulation */}
      <View style={styles.cameraBox}>
        {isScanning ? (
          <>
            <Animated.View
              style={[
                styles.scannerLine,
                { transform: [{ translateY }] },
              ]}
            />
            <View style={styles.frame} />
          </>
        ) : (
          <View style={styles.qrBox}>
            <QrCode size={60} color="#000" />
          </View>
        )}
      </View>

      {/* Scanning text */}
      <Text style={styles.scanText}>
        {isScanning ? "Scanning..." : "QR Code detected!"}
      </Text>
      {isScanning && (
        <Text style={styles.progressText}>{Math.round(scanningProgress)}%</Text>
      )}

      <ScrollView
        style={styles.resultContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {scannedResult ? (
          renderResultCard()
        ) : (
          <View style={styles.quickActions}>
            <Text style={styles.quickTitle}>Quick QR Actions</Text>
            {[
              {
                icon: CreditCard,
                color: "#dbeafe",
                textColor: "#2563eb",
                label: "Pay Bills",
                desc: "Scan QR for quick payments",
              },
              {
                icon: Gift,
                color: "#dcfce7",
                textColor: "#16a34a",
                label: "Offers",
                desc: "Scan for exclusive deals",
              },
              {
                icon: FileText,
                color: "#ffedd5",
                textColor: "#ea580c",
                label: "Menu/Catalog",
                desc: "Scan restaurant menus",
              },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <View key={i} style={styles.actionCard}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: a.color, marginRight: 12 },
                    ]}
                  >
                    <Icon color={a.textColor} size={22} />
                  </View>
                  <View>
                    <Text style={styles.actionTitle}>{a.label}</Text>
                    <Text style={styles.actionDesc}>{a.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cameraBox: {
    alignSelf: "center",
    marginTop: 10,
    width: 280,
    height: 280,
    borderRadius: 12,
    backgroundColor: "#111",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 2,
    borderColor: "#22d3ee",
    borderRadius: 10,
  },
  scannerLine: {
    position: "absolute",
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: "#22d3ee",
  },
  qrBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  scanText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  progressText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 6,
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20,
    padding: 16,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  resultHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: { fontWeight: "600", fontSize: 16 },
  resultSub: { color: "#6b7280", fontSize: 13 },
  paymentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  amount: { fontSize: 20, fontWeight: "700", color: "#007bff" },
  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { color: "#374151", fontWeight: "500" },
  offerBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#22c55e",
    borderRadius: 10,
    alignItems: "center",
    padding: 12,
    marginVertical: 10,
  },
  offerText: { fontSize: 28, color: "#16a34a", fontWeight: "700" },
  offerSub: { color: "#16a34a" },
  offerCode: { color: "#64748b", fontSize: 12, marginTop: 2 },
  infoBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  menuText: { color: "#9a3412" },
  quickActions: { marginTop: 10 },
  quickTitle: { textAlign: "center", fontWeight: "600", marginBottom: 12 },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  actionTitle: { fontWeight: "600", color: "#111827" },
  actionDesc: { color: "#6b7280", fontSize: 12 },
});
