import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import FoodCard from "@/components/Card/FoodCard";
import { moderateScale } from "@/utils/spacing";
import useStore from "@/hooks/useStore";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFavorite, removeFavorite } from "@/api/favorite";

interface Item {
  id: number;
  name: string;
  image: string;
  info: string;
  meals: string;
  price: string;
  restaurantName: string;
  calorie: string;
  isFavorite: boolean;
}

const { width } = Dimensions.get("screen");

export default function Favorite() {
  const token = useStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await getFavorite(token || "");
      setFavorite(res.favoriteDishes);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error Fetching Dish",
        text2: err.response?.data?.error || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id: number) => {
    try {
      await removeFavorite(id, token || "");
      setFavorite((prevFavorites) =>
        prevFavorites.filter((item) => item.id !== id)
      );
      Toast.show({
        type: "success",
        text1: "Removed",
        text2: "Dish removed from favorites.",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error Removing Dish",
        text2: err.response?.data?.error || "An error occurred",
      });
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [token]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  if (favorite.length === 0 && !loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={moderateScale(20)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Favorite</Text>
          <View></View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: moderateScale(16) }}>
            No favorite dishes
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Favorite</Text>
        <View></View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchDishes} />
        }
        contentContainerStyle={{
          paddingBottom: moderateScale(100),
          paddingTop: moderateScale(10),
        }}
      >
        <View style={styles.cardContainer}>
          {favorite.map((item) => (
            <FoodCard
            key={item.id}
              id={item.id}
              name={item.name}
              restaurantName={item.restaurantName}
              image={item.image}
              calorie={item.calorie}
              price={item.price}
              isFavorite
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#0F6D41",
    padding: moderateScale(5),
    borderRadius: moderateScale(4),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsLight",
    color: "#000",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(15),
  },
});
