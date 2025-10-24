import { Stack } from "expo-router";
import {
  Home,
  MessageCircle,
  Package,
  QrCode,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

// === SCREENS ===
import ChatScreen from "./components/ChatScreen";
import GroceryScreen from "./components/GroceryScreen";
import HomeScreen from "./components/HomeScreen";
import HomeServicesScreen from "./components/HomeServicesScreen";
import MedicineScreen from "./components/MedicineScreen";
import OrdersScreen from "./components/OrdersScreen";
import PaymentsScreen from "./components/PaymentsScreen";
import ProfileScreen from "./components/ProfileScreen";
import QRScanner from "./components/QRScanner";
import RideScreen from "./components/RideScreen";
import SignInScreen from "./components/SignInScreen";
import SignUpScreen from "./components/SignUpScreen";
import SubscriptionsScreen from "./components/SubscriptionsScreen";
import WelcomeScreen from "./components/WelcomeScreen";

// === FOOD FLOW COMPONENTS ===
import FoodCheckout from "./components/FoodCheckout";
import FoodMenu from "./components/FoodMenu";
import FoodRestaurants from "./components/FoodRestaurants";
import FoodTracking from "./components/FoodTracking";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [authScreen, setAuthScreen] = useState("welcome");
  const [activeScreen, setActiveScreen] = useState("home");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // ===== FOOD FLOW STATES =====
  const [foodView, setFoodView] = useState("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ===== LOAD USER ON APP START =====
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("current_user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("❌ Error loading user:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // ===== FADE ANIMATION =====
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [activeScreen]);

  // ===== AUTH HANDLERS =====
  const handleWelcomeComplete = () => {
    setIsFirstTime(false);
    setAuthScreen("signin");
  };

  const handleSignIn = async (tokens) => {
    try {
      const storedName = await AsyncStorage.getItem("user_name");
      const user = { first_name: storedName || "User" };
      await AsyncStorage.setItem("current_user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveScreen("home");
    } catch (err) {
      console.error("❌ SignIn save error:", err);
    }
  };

  const handleSignUp = async (tokens) => {
    try {
      const storedName = await AsyncStorage.getItem("user_name");
      const user = { first_name: storedName || "User" };
      await AsyncStorage.setItem("current_user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setActiveScreen("home");
    } catch (err) {
      console.error("❌ SignUp save error:", err);
    }
  };

  const handleSignOut = async () => {
    await AsyncStorage.multiRemove(["current_user", "access_token", "refresh_token"]);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthScreen("signin");
    setActiveScreen("home");
    setShowQRScanner(false);
  };

  const handleNavigation = (screen) => setActiveScreen(screen);

  // ===== FOOD FLOW HANDLERS =====
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleRestaurantClick = (r) => {
    setSelectedRestaurant(r);
    setFoodView("menu");
  };

  const handleCheckout = () => setFoodView("checkout");
  const handlePlaceOrder = () => {
    setAppliedCoupon(null);
    setFoodView("tracking");
    setCart([]);
  };

  const handleFoodBack = () => {
    if (foodView === "tracking") setFoodView("checkout");
    else if (foodView === "checkout") setFoodView("menu");
    else if (foodView === "menu") setFoodView("restaurants");
    else setActiveScreen("home");
  };

  // ===== AUTH FLOW =====
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    if (isFirstTime && authScreen === "welcome") {
      return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
    if (authScreen === "signin") {
      return (
        <SignInScreen
          onSignIn={handleSignIn}
          onNavigateToSignUp={() => setAuthScreen("signup")}
          isLoading={isLoading}
        />
      );
    }
    return (
      <SignUpScreen
        onSignUp={handleSignUp}
        onNavigateToSignIn={() => setAuthScreen("signin")}
        isLoading={isLoading}
      />
    );
  }

  // ===== MAIN SCREEN RENDERING =====
  const renderScreen = () => {
    const screens = {
      home: <HomeScreen onNavigate={handleNavigation} />,
      chat: <ChatScreen onNavigate={handleNavigation} currentUser={currentUser} />,
      orders: <OrdersScreen onNavigate={handleNavigation} />,
      profile: <ProfileScreen onNavigate={handleNavigation} onSignOut={handleSignOut} />,
      payments: <PaymentsScreen onNavigate={handleNavigation} />,
      grocery: <GroceryScreen onNavigate={handleNavigation} />,
      medicine: <MedicineScreen onNavigate={handleNavigation} />,
      ride: <RideScreen onNavigate={handleNavigation} />,
      "home-services": <HomeServicesScreen onNavigate={handleNavigation} />,
      subscriptions: <SubscriptionsScreen onNavigate={handleNavigation} />,
    };
    return screens[activeScreen] || screens.home;
  };

  // ===== NAV ITEMS =====
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  // ===== RENDER APP =====
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#007bff" barStyle="light-content" />
        <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
          {renderScreen()}
        </Animated.View>

        {showQRScanner && <QRScanner onClose={() => setShowQRScanner(false)} />}

        <View style={styles.navBar}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                onPress={() => handleNavigation(item.id)}
              >
                <Icon color={isActive ? "#007bff" : "#777"} size={24} />
                <Text style={[styles.navLabel, { color: isActive ? "#007bff" : "#777" }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setShowQRScanner(true)}
        >
          <QrCode color="white" size={28} />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainContent: { flex: 1 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 12, marginTop: 2 },
  qrButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "#007bff",
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
