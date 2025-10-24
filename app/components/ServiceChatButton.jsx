import React from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { MessageCircle } from "lucide-react-native";

export default function ServiceChatButton({ serviceName, onNavigate }) {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleChatClick = () => {
    // Navigate to chat and set up service-specific context
    onNavigate("chat");
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleChatClick}
        style={styles.button}
      >
        <MessageCircle color="#007bff" size={18} />
        <Text style={styles.text}>Chat Support</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#007bff33",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#007bff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backdropFilter: "blur(5px)",
  },
  text: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
