import {
    ArrowLeft,
    ChevronRight,
    Clock,
    MapPin,
    MessageCircle,
    Search,
    Star,
} from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function FoodRestaurants({
  onNavigate,
  searchTerm,
  setSearchTerm,
  filteredRestaurants,
  handleRestaurantClick,
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
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onNavigate("home")}
          >
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Food Delivery</Text>
            <Text style={styles.subtitle}>Choose a restaurant</Text>
          </View>
          <TouchableOpacity
            style={[styles.supportButton]}
            onPress={() => onNavigate("chat")}
          >
            <MessageCircle color="#fff" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.supportText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color="#999" size={18} style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search for restaurants or cuisines..."
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
      </MotiView>

      {/* Restaurant List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 400 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Restaurants Near You</Text>
            <Text style={styles.badge}>{filteredRestaurants.length} Found</Text>
          </View>

          {filteredRestaurants.map((restaurant, index) => (
            <MotiView
              key={restaurant.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleRestaurantClick(restaurant)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{restaurant.name}</Text>
                  <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#777" />
                      <Text style={styles.metaText}>
                        {restaurant.deliveryTime}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MapPin size={14} color="#777" />
                      <Text style={styles.metaText}>{restaurant.distance}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star size={14} color="#FFD700" />
                      <Text style={styles.metaText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.price}>
                    ₹{restaurant.priceForTwo} for two
                  </Text>
                </View>
                <ChevronRight size={18} color="#888" />
              </TouchableOpacity>
            </MotiView>
          ))}

          {filteredRestaurants.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No restaurants found</Text>
              <Text style={styles.emptyText}>
                Try searching for different cuisines or names
              </Text>
            </View>
          )}
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 8,
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  subtitle: { color: "#e5e5e5", fontSize: 13 },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  supportText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  scroll: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  badge: {
    fontSize: 13,
    color: "#007bff",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 10,
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  cuisine: { fontSize: 13, color: "#666", marginTop: 2 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  metaText: { fontSize: 12, color: "#777", marginLeft: 3 },
  price: { fontSize: 13, color: "#333", marginTop: 4, fontWeight: "500" },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptyText: { color: "#777", fontSize: 13 },
});
