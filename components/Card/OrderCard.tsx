import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "@/utils/spacing"; // Import moderateScale
import { router } from "expo-router";

interface ProductCardProps {
  id: number;
  title: string;
  totalAmount: number;
  date: string;
  quantity: number;
  image: any;
  onPress?: () => void;
}

const ProductCard = ({
  id,
  title,
  totalAmount,
  date,
  quantity,
  image,
  onPress,
}: ProductCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text style={styles.price}>${totalAmount}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.date}>
            {" "}
            {new Date(date).toLocaleDateString()}
          </Text>
          <Text style={styles.quantity}>Qty: {quantity}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: "/orders/details",
                params: { orderId: id },
              });
            }}
          >
            <Ionicons
              name="arrow-forward"
              size={moderateScale(16)}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(8),
    alignItems: "center",
  },
  image: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(8),
  },
  content: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  titleRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: moderateScale(5),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#000",
    fontFamily: "PoppinsSemiBold", // Added font family
  },
  price: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#000",
    fontFamily: "PoppinsSemiBold", // Added font family
  },
  detailsRow: {
    flexDirection: "row",
    gap: moderateScale(16),
  },
  date: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "PoppinsRegular", // Added font family
  },
  quantity: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "PoppinsRegular", // Added font family
  },
  button: {
    backgroundColor: "#0F6D41",
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(3),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: moderateScale(12),
  },
});

export default ProductCard;
