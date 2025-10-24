import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";
import CountryPicker from "react-native-country-picker-modal";
import { ArrowLeft, Search, MessageCircle } from "lucide-react-native";

// 🧩 Microservices setup
const AUTH_URL = "http://10.214.135.184:8000"; // Auth microservice (token refresh)
const CHAT_URL = "http://10.214.135.184:8001"; // Chat microservice (contacts, chats)

// ✅ Corrected token refresh (calls AUTH service)
async function refreshAccessToken() {
  try {
    const refresh = await AsyncStorage.getItem("refresh_token");
    if (!refresh) return null;

    const res = await fetch(`${AUTH_URL}/api/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      console.log("❌ Refresh token invalid or expired");
      return null;
    }

    const data = await res.json();
    const newAccess = data.access;
    await AsyncStorage.setItem("access_token", newAccess);
    console.log("✅ Token refreshed from AUTH service");
    return newAccess;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    return null;
  }
}

// ✅ Wrapper for CHAT service API calls
async function fetchWithAuth(path, options = {}) {
  const url = `${CHAT_URL}${path}`;
  let token = await AsyncStorage.getItem("access_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 422) {
    console.log("⚠️ Token expired, refreshing...");
    const newToken = await refreshAccessToken();
    if (!newToken) throw new Error("Session expired");

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
}

export default function ContactsScreen({ onClose, onStartChat, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");

  const [localUser, setLocalUser] = useState(currentUser);

  // ✅ Load user and JWT
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("current_user");
        const accessToken = await AsyncStorage.getItem("access_token");
        if (storedUser && !currentUser) setLocalUser(JSON.parse(storedUser));
        if (accessToken) setToken(accessToken);
        console.log("✅ Loaded JWT token");
      } catch (err) {
        console.error("❌ Failed to load auth data:", err);
      }
    })();
  }, [currentUser]);

  // ✅ Fetch contacts from CHAT microservice
  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) {
        console.log("⏳ Waiting for token...");
        return;
      }

      try {
        console.log("📡 Fetching contacts...");
        const res = await fetchWithAuth("/api/contacts");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        console.log("✅ Contacts loaded:", data.length);
        setContacts(data);
      } catch (err) {
        console.error("❌ Error loading contacts:", err);
        Alert.alert("Error", "Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

  // ✅ Filter contacts
  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  // ✅ Start new chat (via CHAT service)
  const handleStartChat = async (contact) => {
    const userPhone = localUser?.phone_number || currentUser?.phone_number;
    if (!userPhone) {
      Alert.alert("Error", "User not logged in. Please sign in again.");
      return;
    }

    try {
      console.log("💬 Starting chat between", userPhone, "and", contact.phone);

      const res = await fetchWithAuth("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          avatar: contact.avatar,
          type: "personal",
          participants: [userPhone, contact.phone],
        }),
      });

      if (!res.ok) throw new Error("Chat creation failed");

      const data = await res.json();
      if (data.success) {
        const newChat = {
          id: data.chat_id,
          name: contact.name,
          phone: contact.phone,
          avatar: contact.avatar,
          type: "personal",
          isOnline: contact.isOnline,
          messages: [],
        };
        console.log("✅ Chat created successfully");
        onStartChat(newChat);
        onClose();
      } else {
        Alert.alert("Error", data.error || "Failed to start chat.");
      }
    } catch (err) {
      console.error("❌ Error creating chat:", err);
      Alert.alert("Error", "Failed to start chat. Please try again.");
    }
  };

  // ✅ Add new contact
  const handleSaveContact = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newPhone)) {
      Alert.alert("Invalid Number", "Phone number must be exactly 10 digits");
      return;
    }

    const fullPhone = `+${callingCode}${newPhone}`;
    const payload = {
      name: newName,
      phone: fullPhone,
      avatar: "https://via.placeholder.com/100",
      status: "Hey there! I’m using SuperApp",
    };

    try {
      console.log("📱 Adding contact:", payload);

      const res = await fetchWithAuth("/api/contacts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add contact");

      const data = await res.json();
      if (data.success) {
        const newContact = {
          id: data.id,
          name: newName,
          phone: fullPhone,
          avatar: "https://via.placeholder.com/100",
          status: "Hey there! I’m using SuperApp",
          isOnline: false,
          lastSeen: "Just now",
        };
        setContacts((prev) => [...prev, newContact]);
        setShowDialog(false);
        setNewName("");
        setNewPhone("");
        Alert.alert("✅ Success", "Contact added successfully!");
      } else {
        Alert.alert("Error", data.error || "Failed to add contact.");
      }
    } catch (err) {
      console.error("❌ Network error while saving contact:", err);
      Alert.alert("Error", "Unable to connect to server.");
    }
  };

  // ✅ Loading view
  if (!token || !localUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>New Chat</Text>
            <Text style={styles.headerSubtitle}>
              {filteredContacts.length} contacts
            </Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* QUICK ACTION */}
      <View style={styles.quickSection}>
        <TouchableOpacity
          style={styles.quickCard}
          onPress={() => setShowDialog(true)}
        >
          <View style={[styles.quickIcon, { backgroundColor: "#dbeafe" }]}>
            <MessageCircle color="#2563eb" size={24} />
          </View>
          <View>
            <Text style={styles.quickTitle}>New Contact</Text>
            <Text style={styles.quickSubtitle}>Add a new contact</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* CONTACT LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          <Text style={styles.sectionLabel}>CONTACTS ON SUPERAPP</Text>
          {filteredContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactRow}
              onPress={() => handleStartChat(contact)}
            >
              <View style={styles.avatarContainer}>
                {contact.avatar ? (
                  <Image source={{ uri: contact.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                      {contact.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactStatus}>{contact.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ADD CONTACT DIALOG */}
      <Dialog.Container visible={showDialog}>
        <Dialog.Title>Add New Contact</Dialog.Title>
        <View style={styles.countryRow}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCodeButton
            withFlag
            withFilter
            withEmoji
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <TextInput
            style={[styles.dialogInput, { flex: 1 }]}
            placeholder="Enter 10-digit number"
            keyboardType="phone-pad"
            value={newPhone}
            maxLength={10}
            onChangeText={setNewPhone}
          />
        </View>
        <Dialog.Input
          label="Name"
          placeholder="Enter contact name"
          value={newName}
          onChangeText={setNewName}
        />
        <Dialog.Button label="Cancel" onPress={() => setShowDialog(false)} />
        <Dialog.Button label="Save" onPress={handleSaveContact} />
      </Dialog.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingLeft: 36,
    height: 40,
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  quickSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickCard: { flexDirection: "row", alignItems: "center" },
  quickIcon: { padding: 10, borderRadius: 100, marginRight: 12 },
  quickTitle: { fontWeight: "600", color: "#111827" },
  quickSubtitle: { color: "#6b7280", fontSize: 12 },
  sectionLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    elevation: 1,
  },
  avatarContainer: { marginRight: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#0284c7", fontWeight: "700", fontSize: 16 },
  contactInfo: { flex: 1 },
  contactName: { fontWeight: "600", color: "#111827" },
  contactStatus: { color: "#6b7280", fontSize: 12, marginTop: 2 },
  dialogInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 5,
    padding: 5,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
