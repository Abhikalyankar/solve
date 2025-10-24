import {
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Video,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContactsScreen from "./ContactsScreen";

// 🧩 Microservices setup
const AUTH_URL = "http://10.214.135.184:8000"; // Auth microservice (login & token refresh)
const CHAT_URL = "http://10.214.135.184:8001"; // Chat microservice (contacts, chats, messages)

// ✅ Token refresh from AUTH service
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

// ✅ Wrapper for authenticated requests to CHAT service
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

export default function ChatScreen({ onNavigate }) {
  const [activeView, setActiveView] = useState("list");
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  // ✅ Load user & JWT
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("current_user");
        const accessToken = await AsyncStorage.getItem("access_token");
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        if (accessToken) setToken(accessToken);
      } catch (err) {
        console.error("❌ Error loading auth data:", err);
      }
    })();
  }, []);

  // ✅ Connect to Socket.IO (CHAT microservice)
  useEffect(() => {
    if (!currentUser) return;
    socketRef.current = io(CHAT_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to Chat Socket.IO");
    });

    socketRef.current.on("new_message", (data) => {
      if (!data || !data.chat_id) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chat_id
            ? {
                ...chat,
                lastMessage: data.content,
                messages: [...(chat.messages || []), data],
              }
            : chat
        )
      );

      if (activeChat && activeChat.id === data.chat_id) {
        setActiveChat((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), data],
        }));
      }
    });

    return () => socketRef.current?.disconnect();
  }, [currentUser, activeChat]);

  // ✅ Fetch chat list
  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      try {
        const res = await fetchWithAuth("/api/chats");
        if (!res.ok) throw new Error("Failed to load chats");

        const data = await res.json();
        const formatted = data.map((c) => ({
          ...c,
          timestamp: new Date(c.timestamp),
          messages: [],
        }));
        setChats(formatted);
      } catch (err) {
        console.error("❌ Error fetching chats:", err);
        Alert.alert("Error", "Failed to load chats.");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token]);

  // ✅ Open chat and load messages
  const openChat = async (chat) => {
    if (!currentUser?.phone_number || !chat?.phone) {
      Alert.alert("Error", "Invalid user or contact selected");
      return;
    }

    setActiveChat(chat);
    setActiveView("chat");

    try {
      const res = await fetchWithAuth(
        `/api/messages/${encodeURIComponent(currentUser.phone_number)}/${encodeURIComponent(chat.phone)}`
      );
      if (!res.ok) throw new Error("Failed to load messages");

      const data = await res.json();
      const msgs = data.map((m) => ({
        id: m.id,
        sender: m.sender,
        receiver: m.receiver,
        content: m.content,
        timestamp: new Date(m.timestamp),
        status: m.status,
      }));

      const updatedChat = { ...chat, messages: msgs, unreadCount: 0 };
      setActiveChat(updatedChat);
      setChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));

      socketRef.current.emit("join", { chat_id: chat.id });
    } catch (err) {
      console.error("❌ Error loading messages:", err);
      Alert.alert("Error", "Failed to load messages.");
    }
  };

  // ✅ Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeChat || !currentUser) return;

    const newMsg = {
      chat_id: activeChat.id,
      sender: currentUser.phone_number,
      receiver: activeChat.phone,
      content: inputMessage.trim(),
    };

    setInputMessage("");
    try {
      const res = await fetchWithAuth("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      if (!res.ok) {
        console.error("❌ Send message failed:", await res.text());
        return;
      }

      const data = await res.json();
      socketRef.current.emit("send_message", data.message);
    } catch (err) {
      console.error("❌ Network error sending message:", err);
    }
  };

  // 🕒 Time formatter
  const formatTime = (date) => {
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60);
    return diff < 24
      ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const renderStatus = (status) => {
    if (status === "sent") return <Check size={14} color="#999" />;
    if (status === "delivered") return <CheckCheck size={14} color="#999" />;
    if (status === "read") return <CheckCheck size={14} color="#007bff" />;
    return null;
  };

  // ✅ Contacts screen
  if (activeView === "contacts")
    return (
      <ContactsScreen
        currentUser={currentUser}
        onClose={() => setActiveView("list")}
        onStartChat={(contact) => openChat(contact)}
      />
    );

  // ✅ Chat screen
  if (activeView === "chat" && activeChat)
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => {
              socketRef.current.emit("leave", { chat_id: activeChat.id });
              setActiveView("list");
            }}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Image source={{ uri: activeChat.avatar }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>{activeChat.name}</Text>
            <Text style={styles.chatStatus}>
              {activeChat.isOnline ? "online" : "offline"}
            </Text>
          </View>
          <Phone color="#fff" size={22} style={{ marginRight: 12 }} />
          <Video color="#fff" size={22} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {(activeChat.messages || []).map((msg) => (
            <View
              key={msg.id}
              style={[
                msg.sender === currentUser.phone_number
                  ? styles.senderBubble
                  : styles.receiverBubble,
              ]}
            >
              <Text
                style={
                  msg.sender === currentUser.phone_number
                    ? styles.senderText
                    : styles.receiverText
                }
              >
                {msg.content}
              </Text>
              <View
                style={[
                  styles.messageMeta,
                  msg.sender === currentUser.phone_number
                    ? { justifyContent: "flex-end" }
                    : { justifyContent: "flex-start" },
                ]}
              >
                <Text style={styles.timeText}>{formatTime(msg.timestamp)}</Text>
                {msg.sender === currentUser.phone_number &&
                  renderStatus(msg.status)}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.iconBtn}>
            <Plus color="#555" size={20} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Paperclip color="#555" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            {inputMessage.trim() ? (
              <Send color="#fff" size={18} />
            ) : (
              <Mic color="#fff" size={18} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );

  // ✅ Chat list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={{ flexDirection: "row" }}>
          <Search color="#fff" size={20} style={{ marginRight: 12 }} />
          <MoreVertical color="#fff" size={20} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#888" size={18} style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Search chats..."
          placeholderTextColor="#999"
          style={{ flex: 1, color: "#000" }}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {chats
            .filter(
              (chat) =>
                chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.lastMessage
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
            .map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatItem}
                onPress={() => openChat(chat)}
              >
                <Image
                  source={{
                    uri: chat.avatar?.startsWith("http")
                      ? chat.avatar
                      : "https://via.placeholder.com/50",
                  }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.lastMsg} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                </View>
                <Text style={styles.timeText}>{formatTime(chat.timestamp)}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setActiveView("contacts")}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007bff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 10,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  chatName: { fontWeight: "600", fontSize: 16 },
  lastMsg: { color: "#555", fontSize: 14 },
  timeText: { color: "#777", fontSize: 11, marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#007bff",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  chatHeader: {
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  chatStatus: { color: "#eee", fontSize: 12 },
  messagesContainer: { flex: 1, backgroundColor: "#f7f7f7" },
  senderBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 4,
    maxWidth: "80%",
  },
  receiverBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e9ecef",
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 4,
    maxWidth: "80%",
  },
  senderText: { color: "#fff", fontSize: 15 },
  receiverText: { color: "#111", fontSize: 15 },
  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#000",
  },
  iconBtn: { paddingHorizontal: 8 },
  sendBtn: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    padding: 10,
    marginLeft: 4,
  },
});
