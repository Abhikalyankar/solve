import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Search, Upload, Clock } from "lucide-react-native";

export default function MedicineScreen({ onNavigate }) {
  const [search, setSearch] = useState("");

  const categories = [
    { id: "wellness", name: "Wellness", color: "#dcfce7" },
    { id: "personal-care", name: "Personal Care", color: "#dbeafe" },
    { id: "baby-care", name: "Baby Care", color: "#fce7f3" },
    { id: "ayurveda", name: "Ayurveda", color: "#ffedd5" },
  ];

  const medicines = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      company: "Cipla Ltd",
      price: 15,
      originalPrice: 20,
      prescription: false,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
    },
    {
      id: "2",
      name: "Vitamin D3 Tablets",
      company: "Sun Pharma",
      price: 180,
      originalPrice: 220,
      prescription: false,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
    },
    {
      id: "3",
      name: "Cough Syrup",
      company: "Dr. Reddy's",
      price: 85,
      originalPrice: 95,
      prescription: true,
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
    },
  ];

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
          <Text style={styles.headerTitle}>Medicine</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Prescription */}
        <View style={styles.uploadCard}>
          <Upload color="#007bff" size={40} style={{ marginBottom: 8 }} />
          <Text style={styles.uploadTitle}>Upload Prescription</Text>
          <Text style={styles.uploadText}>
            Get medicines delivered in 2 hours with valid prescription
          </Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload & Order</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Order */}
        <View style={styles.card}>
          <View style={styles.quickRow}>
            <Clock color="#007bff" size={24} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.quickTitle}>Quick Order</Text>
              <Text style={styles.quickSub}>
                Reorder your previous medicines
              </Text>
            </View>
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.grid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: cat.color },
                  ]}
                />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Medicines */}
        <View>
          <Text style={styles.sectionTitle}>Popular Medicines</Text>
          {medicines.map((med) => (
            <View key={med.id} style={styles.medicineCard}>
              <Image
                source={{ uri: med.image }}
                style={styles.medicineImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.medicineName}>{med.name}</Text>
                <Text style={styles.medicineCompany}>{med.company}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{med.price}</Text>
                  <Text style={styles.oldPrice}>₹{med.originalPrice}</Text>
                  {med.prescription && (
                    <Text style={styles.rxBadge}>Rx</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#007bff",
    padding: 16,
    paddingBottom: 20,
  },
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
    paddingRight: 12,
    height: 42,
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },

  uploadCard: {
    borderWidth: 1.5,
    borderColor: "#007bff40",
    backgroundColor: "#007bff10",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    padding: 20,
    marginBottom: 16,
  },
  uploadTitle: { fontWeight: "600", marginBottom: 4, color: "#111827" },
  uploadText: {
    color: "#6b7280",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uploadButtonText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    elevation: 1,
    marginBottom: 16,
  },
  quickRow: { flexDirection: "row", alignItems: "center" },
  quickTitle: { fontWeight: "600", color: "#111827" },
  quickSub: { color: "#6b7280", fontSize: 13 },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  outlineText: { color: "#111827", fontSize: 13, fontWeight: "500" },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 16,
    elevation: 1,
    width: "48%",
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginBottom: 6,
  },
  categoryText: { fontSize: 13, fontWeight: "500" },

  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  medicineImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  medicineName: { fontWeight: "600", color: "#111827" },
  medicineCompany: { color: "#6b7280", fontSize: 13 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  price: { fontWeight: "600", color: "#111827" },
  oldPrice: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
    fontSize: 13,
  },
  rxBadge: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontSize: 11,
    fontWeight: "600",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  addText: { color: "#fff", fontWeight: "600" },
});
