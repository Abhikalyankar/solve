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
import { ArrowLeft, Search, Plus, Minus } from "lucide-react-native";

export default function GroceryScreen({ onNavigate }) {
  const [cart, setCart] = useState([]);

  const categories = [
    {
      id: "vegetables",
      name: "Vegetables",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop",
    },
    {
      id: "fruits",
      name: "Fruits",
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop",
    },
    {
      id: "dairy",
      name: "Dairy",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    },
    {
      id: "snacks",
      name: "Snacks",
      image:
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop",
    },
  ];

  const products = [
    {
      id: "1",
      name: "Fresh Tomatoes",
      price: 30,
      unit: "per kg",
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop",
    },
    {
      id: "2",
      name: "Bananas",
      price: 50,
      unit: "per dozen",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop",
    },
    {
      id: "3",
      name: "Milk",
      price: 60,
      unit: "per liter",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",
    },
    {
      id: "4",
      name: "Bread",
      price: 25,
      unit: "per loaf",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
    },
  ];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart.reduce((t, i) => t + i.quantity * i.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onNavigate("home")}
          >
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Grocery</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries..."
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.grid}>
          {categories.map((c) => (
            <View key={c.id} style={styles.categoryCard}>
              <Image
                source={{ uri: c.image }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <Text style={styles.categoryText}>{c.name}</Text>
            </View>
          ))}
        </View>

        {/* Products */}
        <Text style={styles.sectionTitle}>Fresh Products</Text>
        <View style={styles.grid}>
          {products.map((p) => (
            <View key={p.id} style={styles.productCard}>
              <Image
                source={{ uri: p.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productUnit}>{p.unit}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{p.price}</Text>

                {getItemQuantity(p.id) > 0 ? (
                  <View style={styles.counterBox}>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => removeFromCart(p.id)}
                    >
                      <Minus color="#111" size={14} />
                    </TouchableOpacity>
                    <Text style={styles.counterText}>
                      {getItemQuantity(p.id)}
                    </Text>
                    <TouchableOpacity
                      style={styles.counterButton}
                      onPress={() => addToCart(p)}
                    >
                      <Plus color="#111" size={14} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(p)}
                  >
                    <Plus color="#fff" size={14} />
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartCard}>
            <View>
              <Text style={styles.cartItems}>{totalItems} items</Text>
              <Text style={styles.cartPrice}>₹{totalPrice}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  searchInput: { color: "#fff", flex: 1, fontSize: 14 },

  sectionTitle: { fontWeight: "600", fontSize: 16, marginVertical: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },
  categoryImage: { width: 70, height: 70, borderRadius: 8, marginBottom: 6 },
  categoryText: { fontSize: 13, fontWeight: "500" },

  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    marginBottom: 12,
    elevation: 1,
  },
  productImage: { width: "100%", height: 90, borderRadius: 8, marginBottom: 6 },
  productName: { fontWeight: "600", color: "#111827", fontSize: 13 },
  productUnit: { color: "#6b7280", fontSize: 12, marginBottom: 4 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontWeight: "600", color: "#111827" },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addText: { color: "#fff", marginLeft: 4, fontWeight: "600", fontSize: 12 },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  counterButton: { padding: 4 },
  counterText: { fontSize: 13, fontWeight: "500", minWidth: 20, textAlign: "center" },

  cartFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  cartCard: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartItems: { color: "#fff", opacity: 0.9, fontSize: 13 },
  cartPrice: { color: "#fff", fontWeight: "700", fontSize: 16 },
  checkoutButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  checkoutText: { color: "#007bff", fontWeight: "600" },
});
