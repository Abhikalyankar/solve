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
import {
  ArrowLeft,
  Search,
  Star,
  Plus,
  Clock,
  Minus,
  MessageCircle,
} from "lucide-react-native";

export default function FoodScreen({ onNavigate }) {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("popular");

  const categories = [
    { id: "popular", name: "Popular" },
    { id: "pizza", name: "Pizza" },
    { id: "burger", name: "Burgers" },
    { id: "indian", name: "Indian" },
    { id: "chinese", name: "Chinese" },
  ];

  const restaurants = [
    {
      id: "1",
      name: "Pizza Hut",
      cuisine: "Italian, Fast Food",
      rating: 4.2,
      deliveryTime: "25-30 mins",
      offer: "50% OFF",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      name: "Burger King",
      cuisine: "Burgers, Fast Food",
      rating: 4.1,
      deliveryTime: "20-25 mins",
      offer: "Buy 1 Get 1",
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      name: "Subway",
      cuisine: "Healthy, Sandwiches",
      rating: 4.0,
      deliveryTime: "30-35 mins",
      offer: "20% OFF",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    },
  ];

  const menuItems = [
    { id: "1", name: "Margherita Pizza", price: 299, rating: 4.5, veg: true },
    { id: "2", name: "Chicken Burger", price: 199, rating: 4.3, veg: false },
    { id: "3", name: "Veg Sandwich", price: 149, rating: 4.1, veg: true },
    { id: "4", name: "Pasta Italiano", price: 249, rating: 4.4, veg: true },
  ];

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getItemQuantity = (itemId) => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onNavigate("home")}
            >
              <ArrowLeft color="#fff" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Food Delivery</Text>
          </View>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => onNavigate("chat")}
          >
            <MessageCircle color="#fff" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.chatText}>Food Support</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or dishes..."
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Restaurants */}
        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
        {restaurants.map((r) => (
          <TouchableOpacity key={r.id} style={styles.restaurantCard}>
            <Image source={{ uri: r.image }} style={styles.restaurantImage} />
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>{r.offer}</Text>
            </View>

            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantHeader}>
                <View>
                  <Text style={styles.restaurantName}>{r.name}</Text>
                  <Text style={styles.restaurantCuisine}>{r.cuisine}</Text>
                </View>
                <View style={styles.ratingBox}>
                  <Star color="#facc15" fill="#facc15" size={16} />
                  <Text style={styles.ratingText}>{r.rating}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Clock color="#6b7280" size={14} />
                <Text style={styles.deliveryTime}>{r.deliveryTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Menu Items */}
        <Text style={styles.sectionTitle}>Popular Items</Text>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <View
                    style={[
                      styles.vegBox,
                      { borderColor: item.veg ? "#16a34a" : "#dc2626" },
                    ]}
                  >
                    <View
                      style={[
                        styles.vegDot,
                        { backgroundColor: item.veg ? "#16a34a" : "#dc2626" },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.menuDetails}>
                  <View style={styles.ratingBox}>
                    <Star color="#facc15" fill="#facc15" size={16} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.menuPrice}>₹{item.price}</Text>
                </View>
              </View>

              {getItemQuantity(item.id) > 0 ? (
                <View style={styles.counterBox}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Minus color="#111" size={14} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>
                    {getItemQuantity(item.id)}
                  </Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => addToCart(item)}
                  >
                    <Plus color="#111" size={14} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                >
                  <Plus color="#fff" size={14} />
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <View style={styles.cartFooter}>
          <View style={styles.cartCard}>
            <View>
              <Text style={styles.cartItems}>
                {cart.reduce((t, i) => t + i.quantity, 0)} items
              </Text>
              <Text style={styles.cartPrice}>₹{getCartTotal()}</Text>
            </View>
            <TouchableOpacity style={styles.viewCartButton}>
              <Text style={styles.viewCartText}>View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chatText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginTop: 12,
    paddingLeft: 36,
    height: 40,
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },

  categories: { paddingVertical: 10, paddingHorizontal: 10, backgroundColor: "#fff" },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
  categoryText: { fontSize: 13, color: "#111827" },
  categoryTextActive: { color: "#fff" },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },

  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  restaurantImage: { width: "100%", height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  offerBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#16a34a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offerText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  restaurantInfo: { padding: 10 },
  restaurantHeader: { flexDirection: "row", justifyContent: "space-between" },
  restaurantName: { fontWeight: "600", color: "#111827" },
  restaurantCuisine: { color: "#6b7280", fontSize: 12 },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, fontWeight: "500" },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  deliveryTime: { color: "#6b7280", fontSize: 12 },

  menuCard: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10, elevation: 1 },
  menuRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuName: { fontWeight: "600", color: "#111827" },
  vegBox: { width: 14, height: 14, borderWidth: 1, borderRadius: 3, alignItems: "center", justifyContent: "center" },
  vegDot: { width: 8, height: 8, borderRadius: 8 },
  menuDetails: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 },
  menuPrice: { fontWeight: "600", color: "#111827" },
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
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addText: { color: "#fff", marginLeft: 4, fontWeight: "600", fontSize: 12 },

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
  viewCartButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  viewCartText: { color: "#007bff", fontWeight: "600" },
});
