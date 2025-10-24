import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  ArrowRight,
  Smartphone,
  Shield,
  Zap,
  Star,
} from "lucide-react-native";

export default function WelcomeScreen({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const slides = [
    {
      icon: Smartphone,
      title: "Everything in One App",
      description:
        "Food, rides, payments, groceries, and more - all in your pocket.",
      color: ["#3b82f6", "#2563eb"],
      bgColor: "#eff6ff",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Quick QR payments, instant bookings, and real-time tracking.",
      color: ["#f59e0b", "#f97316"],
      bgColor: "#fef9c3",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description:
        "Bank-grade security with end-to-end encryption for all transactions.",
      color: ["#22c55e", "#16a34a"],
      bgColor: "#dcfce7",
    },
    {
      icon: Star,
      title: "Loved by Millions",
      description:
        "Join over 10 million users across India who trust SuperApp daily.",
      color: ["#ef4444", "#dc2626"],
      bgColor: "#fee2e2",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  useEffect(() => {
    fadeAnim.setValue(0);
    translateY.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide]);

  const current = slides[currentSlide];
  const Icon = current.icon;

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <View style={styles.logoDot} />
          </View>
        </View>
        <TouchableOpacity onPress={onComplete}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide */}
      <Animated.View
        style={[
          styles.slideContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: current.bgColor },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: current.color[0],
              },
            ]}
          >
            <Icon color="#fff" size={40} />
          </View>
        </View>

        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.description}>{current.description}</Text>
      </Animated.View>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentSlide && styles.activeIndicator,
            ]}
            onPress={() => handleSlideChange(index)}
          />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10M+</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Cities</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8★</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Get Started */}
      <TouchableOpacity style={styles.startButton} onPress={onComplete}>
        <Text style={styles.startText}>Get Started</Text>
        <Animated.View
          style={{
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 6],
                }),
              },
            ],
          }}
        >
          <ArrowRight color="#fff" size={22} />
        </Animated.View>
      </TouchableOpacity>

      {/* Trust Section */}
      <View style={styles.trustContainer}>
        <Text style={styles.trustText}>
          Trusted by leading banks and verified by RBI
        </Text>
        <View style={styles.trustLogos}>
          <View style={styles.trustLogo} />
          <View style={styles.trustLogo} />
          <View style={styles.trustLogo} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoOuter: {
    width: 40,
    height: 40,
    backgroundColor: "#007bff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoInner: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoDot: {
    width: 14,
    height: 14,
    backgroundColor: "#007bff",
    borderRadius: 7,
  },
  skipText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d5db",
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: "#007bff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 24,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 12,
    paddingVertical: 10,
    width: "28%",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  startButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 30,
    marginHorizontal: 24,
    paddingVertical: 14,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  trustContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  trustText: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  trustLogos: {
    flexDirection: "row",
    justifyContent: "center",
  },
  trustLogo: {
    width: 32,
    height: 20,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    marginHorizontal: 6,
  },
});
