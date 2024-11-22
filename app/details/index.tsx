import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { IcBack } from "@/components/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartCreate, Dish } from "@/interfaces";
import Toast from "react-native-toast-message";
import { addToCart } from "@/api/cart";
import useStore from "@/hooks/useStore";

const dishImage = require("../../assets/images/assets/dish1.png");

export default function FoodDetails() {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1); // Quantity state
  const searchParams = useLocalSearchParams();
  const token = useStore((state) => state.token);

  const dish: Dish =
    typeof searchParams.dish === "string"
      ? JSON.parse(searchParams.dish)
      : {
          id: 0,
          name: "Unknown Dish",
          image: "",
          info: "No description available",
          price: "0.00",
          meals: "",
        };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const data: CartCreate = {
        dishId: dish.id,
        quantity,
      };
      const response = await addToCart(data, token || "");
      console.log(response, "res");
      Toast.show({
        type: "success",
        text1: "Added to Cart Successfully",
      });
      router.push("/(cart)");
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

  const increaseQuantity = () => setQuantity((prev) => prev + 1); // Increase quantity
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1); // Decrease quantity (min 1)
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ height: moderateScale(300), width: "100%" }}>
          <Image
            source={
              typeof dish.image === "string" &&
              dish.image.startsWith("data:image")
                ? { uri: dish.image }
                : typeof dish.image === "string"
                ? { uri: dish.image }
                : dishImage
            }
            style={styles.image}
          />
          <SafeAreaView
            style={{
              position: "absolute",
              top: 0,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingHorizontal: moderateScale(16),
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "black",
                opacity: 0.5,
                padding: moderateScale(4),
                borderRadius: moderateScale(120),
              }}
            >
              <IcBack />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{dish.name}</Text>
          <Text style={styles.description}>{dish.info}</Text>
          <Text style={styles.price}>${dish.price}</Text>
          <Text style={styles.mealTiming}>Suitable for: {dish.meals}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
            >
              <Text style={styles.quantityText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityDisplay}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <Text style={styles.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingVertical: moderateScale(32),
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F5F5",
        }}
      >
        <TouchableOpacity
          style={[styles.orderButton, loading && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.orderButtonText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: moderateScale(20),
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: moderateScale(300),
    resizeMode: "cover",
    borderBottomLeftRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    overflow: "hidden",
    marginBottom: moderateScale(20),
  },
  detailsContainer: {
    width: "90%",
    padding: moderateScale(16),
    marginTop: moderateScale(16),
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(5) },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: "PoppinsBold",
    marginBottom: moderateScale(8),
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsRegular",
    color: "#666",
    textAlign: "center",
    marginBottom: moderateScale(12),
  },
  price: {
    fontSize: moderateScale(20),
    fontFamily: "PoppinsSemiBold",
    color: "#D9534F",
    marginBottom: moderateScale(8),
  },
  mealTiming: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsMedium",
    color: "#888",
    marginBottom: moderateScale(20),
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: moderateScale(16),
  },
  quantityButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#D9534F",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  quantityDisplay: {
    marginHorizontal: moderateScale(12),
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
  },
  orderButton: {
    backgroundColor: "#D9534F",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginTop: moderateScale(10),
    width: "90%",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    width: "90%",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
});
