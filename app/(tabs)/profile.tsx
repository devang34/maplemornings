import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useStore from "@/hooks/useStore";
import { getProfile } from "@/api/auth";
import { moderateScale } from "@/utils/spacing";

interface User {
  email: string;
  username: string;
}

const Profile = () => {
  const token = useStore((state) => state.token);
  const [user, setUser] = useState<User>();
  const [loading, setLaoding] = useState(true);
  const removeToken = useStore((state) => state.removeToken);
  const setDisease = useStore((state) => state.setDisease);
  const setUsername = useStore((state) => state.setUsername);
  const resetIsVerified = useStore((state) => state.resetIsVerified);

  useEffect(() => {
    getProfile(token || "")
      .then((res) => {
        console.log(res);
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLaoding(false);
      });
  }, []);

  const handleLogout = () => {
    removeToken();
    setDisease("");
    resetIsVerified();
    setUsername("");
    router.push("/(auth)");
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Settings */}
        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Email: {user?.email}</Text>
        </Pressable>

        <Pressable style={styles.linkButton}>
          <Text style={styles.linkText}>Username: {user?.username}</Text>
        </Pressable>

        <View style={styles.divider} />

        {/* Other Settings */}
        <TouchableOpacity
          onPress={() => router.push("/favorite")}
          style={styles.sectionButton}
        >
          <Text style={styles.sectionButtonText}>Favorite Dishes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/details/privacy")}
          style={styles.sectionButton}
        >
          <Text style={styles.sectionButtonText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/details/terms")}
          style={styles.sectionButton}
        >
          <Text style={styles.sectionButtonText}>Terms & Condition</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },
  sectionButton: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionButtonText: {
    fontSize: 16,
    color: "#000",
  },
  logoutContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: "auto",
    paddingVertical: 24,
  },
  logoutButton: {
    backgroundColor: "#0F6D41",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
