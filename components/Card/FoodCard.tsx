import { addToCart } from "@/api/cart";
import { addFavorite, getFavorite, removeFavorite } from "@/api/favorite";
import useStore from "@/hooks/useStore";
import { CartCreate } from "@/interfaces";
import { moderateScale } from "@/utils/spacing";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LocalSvg } from "react-native-svg/css";
import Toast from "react-native-toast-message";

interface FoodCardProps {
  id: number;
  name: string;
  image: string;
  price: string;
  restaurantName: string;
  calorie: string;
  isFavorite: boolean;
}

export default function FoodCard({
  id,
  name,
  restaurantName,
  image,
  calorie,
  price,
  isFavorite,
}: FoodCardProps) {
  const [liked, setLiked] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const token = useStore((state) => state.token);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const data: CartCreate = {
        dishId: Number(id),
        quantity: 1,
      };
      const response = await addToCart(data, token || "");
      console.log(response, "res");
      Toast.show({
        type: "success",
        text1: "Added to Cart Successfully",
      });
      router.push("/cart");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add to cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    try {
      const response = await addFavorite(id, token || "");
      console.log(response, "res");
      setLiked(true);
      Toast.show({
        type: "success",
        text1: "Added to Favorite Successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response.data.error,
      });
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      const response = await removeFavorite(id, token || "");
      console.log(response, "res");
      setLiked(false);
      Toast.show({
        type: "success",
        text1: "Removed from Favorite Successfully",
      });
    } catch (error: any) {
      console.log(error.response.data);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove from favorite.",
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/details",
          params: {
            id,
          },
        })
      }
      style={styles.card}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        width={1000}
        height={1000}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {restaurantName}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#FFC72C33",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={liked ? handleRemoveFavorite : handleAddFavorite}
          >
            {liked ? (
              <AntDesign name="heart" size={14} color="#0F6D41" />
            ) : (
              <Feather name="heart" size={14} color="#0F6D41" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.calorieContainer}>
          <LocalSvg
            asset={require("../../assets/images/cal.svg")}
            width={10}
            height={10}
          />
          <Text style={styles.calories}>{calorie} kcal</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>${price}</Text>
          <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
            {loading ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={moderateScale(8)} />
              </View>
            ) : (
              <Text style={styles.addButtonText}>ADD</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: moderateScale(6),
    overflow: "hidden",
    borderWidth: 0.87,
    borderColor: "#E7E7E7",
    padding: moderateScale(12),
    width: "48%",
    marginBottom: moderateScale(16),
  },
  image: {
    width: "100%",
    height: moderateScale(95),
    resizeMode: "cover",
    borderRadius: moderateScale(4),
  },
  content: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(14),
    color: "#000",
    fontFamily: "PoppinsSemiBold",
  },
  subtitle: {
    fontSize: moderateScale(10),
    color: "#71717a",
    marginBottom: moderateScale(2),
    fontFamily: "PoppinsMedium",
  },
  calorieContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(5),
  },
  calories: {
    marginLeft: moderateScale(4),
    fontFamily: "PoppinsRegular",
    color: "#71717a",
    fontSize: moderateScale(10),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: moderateScale(12),
    color: "#000",
    fontFamily: "PoppinsSemiBold",
  },
  addButton: {
    backgroundColor: "#0F6D41",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(4),
  },
  addButtonText: {
    color: "white",
    fontSize: moderateScale(8),
    fontFamily: "PoppinsSemiBold",
  },
});
