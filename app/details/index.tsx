import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Pressable } from "react-native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocalSvg } from "react-native-svg/css";
import { moderateScale } from "@/utils/spacing";
import { getDishById } from "@/api/diseases";
import useStore from "@/hooks/useStore";
import { CartCreate } from "@/interfaces";
import Toast from "react-native-toast-message";
import { addToCart } from "@/api/cart";

const DetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const { id }: { id: string } = useLocalSearchParams();
  const token = useStore((state) => state.token);
  const [dishData, setDishData] = useState<any>(null);

  useEffect(() => {
    getDishById(id, token || "")
      .then((res) => {
        console.log(res);
        setDishData(res);
      })
      .catch((err) => {
        console.log(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

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

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#000" />
      </View>
    );

  if (!dishData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: Dish not found</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: moderateScale(16),
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Product Image */}
        <Image source={{ uri: dishData.image }} style={styles.productImage} />

        {/* Product Information */}
        <View style={styles.productInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.productTitle}>{dishData.name}</Text>
            <Text style={styles.productPrice}>${dishData.price}</Text>
          </View>

          <Text style={styles.restaurantName}>{dishData.restaurantName}</Text>

          <View style={styles.caloriesContainer}>
            <LocalSvg
              asset={require("../../assets/images/cal1.svg")}
              width={moderateScale(14)}
              height={moderateScale(14)}
            />
            <Text style={styles.calories}>{dishData.calorie} kcal</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{dishData.info}</Text>
          </View>

          <View
            style={[
              styles.section,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <Text style={styles.sectionTitle}>Suitable for</Text>
            <View style={styles.tagsContainer}>
              {dishData.meals.split(", ").map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <Pressable style={styles.moreDetails}>
            <Text style={styles.sectionTitle}>More details</Text>
            <Text
              onPress={() => Linking.openURL(dishData.refrence)}
              style={styles.moreDetailsText}
            >
              Check on web ›
            </Text>
          </Pressable>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
  },
  productImage: {
    width: "100%",
    height: moderateScale(200),
    borderRadius: moderateScale(10),
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  backButton: {
    padding: moderateScale(5),
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
  },
  productInfo: {
    marginTop: moderateScale(16),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  productTitle: {
    fontSize: moderateScale(24),
    color: "#000",
    fontFamily: "PoppinsSemiBold",
  },
  productPrice: {
    fontSize: moderateScale(20),
    color: "#000",
    fontFamily: "PoppinsSemiBold",
  },
  restaurantName: {
    fontSize: moderateScale(12),
    color: "#8D8D8D",
    fontFamily: "PoppinsMedium",
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(10),
  },
  calories: {
    fontSize: moderateScale(14),
    color: "#0F6D41",
    paddingTop: moderateScale(3),
    marginLeft: moderateScale(4),
    fontFamily: "PoppinsMedium",
  },
  section: {
    marginBottom: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    color: "#000",
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(20),
    color: "#8D8D8D",
    fontFamily: "PoppinsRegular",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
    marginLeft: moderateScale(8),
  },
  tag: {
    backgroundColor: "#0F6D41",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(4),
  },
  tagText: {
    color: "#fff",
    fontSize: moderateScale(8),
    fontFamily: "PoppinsMedium",
  },
  moreDetails: {
    marginTop: moderateScale(8),
    flexDirection: "row",
    alignItems: "center",
  },
  moreDetailsText: {
    color: "#666",
    fontSize: moderateScale(14),
    marginLeft: moderateScale(8),
    textDecorationLine: "underline",
    fontFamily: "PoppinsRegular",
  },
  addToCartButton: {
    backgroundColor: "#0F6D41",
    marginTop: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(4),
    alignItems: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontFamily: "PoppinsMedium",
  },
});

export default DetailsPage;
