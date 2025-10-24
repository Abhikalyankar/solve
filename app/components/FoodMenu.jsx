import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import { ArrowLeft, Star, Plus, Minus, ChevronRight } from "lucide-react-native";

export default function FoodMenu({
  selectedRestaurant,
  filteredMenuItems,
  cart,
  addToCart,
  removeFromCart,
  getItemQuantity,
  getCartTotal,
  handleCheckout,
  handleBack,
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
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{selectedRestaurant.name}</Text>
            <Text style={styles.headerSubtitle}>
              {selectedRestaurant.cuisine}
            </Text>
          </View>
        </View>
      </MotiView>

      {/* Menu Items */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {filteredMenuItems.map((item, index) => (
          <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 80 }}
          >
            <View style={styles.card}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.image} />
              )}
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>

                <View style={styles.row}>
                  <View style={styles.priceRating}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <View style={styles.rating}>
                      <Star size={14} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>

                  {/* Add/Remove Buttons */}
                  {getItemQuantity(item.id) > 0 ? (
                    <View style={styles.counter}>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.counterBtn}
                      >
                        <Minus color="#007bff" size={14} />
                      </TouchableOpacity>
                      <Text style={styles.counterText}>
                        {getItemQuantity(item.id)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        style={styles.counterBtn}
                      >
                        <Plus color="#007bff" size={14} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(item)}
                    >
                      <Plus color="#fff" size={14} />
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </MotiView>
        ))}

        {filteredMenuItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍕</Text>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
      </ScrollView>

      {/* Cart Footer */}
      {cart.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400 }}
          style={styles.cartFooter}
        >
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleCheckout}
            activeOpacity={0.9}
          >
            <View>
              <Text style={styles.cartItemCount}>{cart.length} items</Text>
              <Text style={styles.cartTotal}>₹{getCartTotal()}</Text>
            </View>
            <View style={styles.cartRight}>
              <Text style={styles.checkoutText}>Checkout</Text>
              <ChevronRight color="#fff" size={18} />
            </View>
          </TouchableOpacity>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  header: { backgroundColor: "#007bff", padding: 16 },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { color: "#e5e5e5", fontSize: 13 },

  scroll: { padding: 16 },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  desc: { fontSize: 12, color: "#666", marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceRating: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 14, fontWeight: "600", color: "#333" },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, color: "#777" },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  counterBtn: { padding: 4 },
  counterText: { fontSize: 13, marginHorizontal: 6, fontWeight: "500" },

  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },

  cartFooter: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  cartButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartItemCount: { color: "#fff", fontSize: 13 },
  cartTotal: { color: "#fff", fontSize: 18, fontWeight: "600" },
  cartRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  checkoutText: { color: "#fff", fontWeight: "500", fontSize: 14 },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: "#777", fontSize: 14 },
});
