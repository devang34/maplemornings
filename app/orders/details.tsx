import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOrderById } from "@/api/order";
import useStore from "@/hooks/useStore";
import { moderateScale } from "@/utils/spacing";
import { IcBack } from "@/components/icons";
import { Order } from "@/interfaces";
import { Ionicons } from "@expo/vector-icons";

const OrderDetails = () => {
  const { orderId } = useLocalSearchParams();
  const token = useStore((state) => state.token);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(Number(orderId), token || "")
        .then((res) => {
          setOrder(res);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, token]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#D9534F" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Failed to load order details.</Text>
      </SafeAreaView>
    );
  }

  const {
    dish,
    quantity,
    totalAmount,
    address,
    pincode,
    status,
    paymentStatus,
    createdAt,
  }: Order = order;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.emptyButton} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order Status:</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{paymentStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Order Created:</Text>
            <Text style={styles.value}>
              {new Date(createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Dish Details */}
        <View style={styles.dishDetails}>
          <Text style={styles.title}>Dish Information</Text>
          <Image source={{ uri: dish.image }} style={styles.dishImage} />
          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishDescription}>{dish.info}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Calories:</Text>
            <Text style={styles.value}>{dish.calorie} kcal</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Price per Dish:</Text>
            <Text style={styles.value}>${dish.price}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{quantity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>${Number(totalAmount).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.deliveryInfo}>
          <Text style={styles.title}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Delivery Address:</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pincode:</Text>
            <Text style={styles.value}>{pincode}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: moderateScale(16),
  },
  scrollContent: {
    paddingBottom: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: "PoppinsSemiBold",
    color: "#333",
    marginBottom: moderateScale(12),
  },
  orderSummary: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  dishDetails: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  deliveryInfo: {
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsMedium",
    color: "#666",
  },
  value: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsRegular",
    color: "#333",
  },
  dishImage: {
    width: "100%",
    height: moderateScale(180),
    borderRadius: moderateScale(8),
    resizeMode: "cover",
    marginBottom: moderateScale(12),
  },
  dishName: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#333",
    marginBottom: moderateScale(8),
    textAlign: "center",
  },
  dishDescription: {
    fontSize: moderateScale(14),
    fontFamily: "PoppinsRegular",
    color: "#666",
    marginBottom: moderateScale(16),
    textAlign: "center",
  },
  referenceButton: {
    backgroundColor: "#007BFF",
    paddingVertical: moderateScale(12),
    alignItems: "center",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(20),
  },
  referenceButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontFamily: "PoppinsMedium",
  },
  errorText: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsMedium",
    color: "red",
    textAlign: "center",
  },
  header: {
    marginBottom: moderateScale(16),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginLeft: moderateScale(8),
  },
  backButton: {
    padding: moderateScale(5),
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
  },
  emptyButton: {
    backgroundColor: "white",
    opacity: 0.5,
    padding: moderateScale(4),
    borderRadius: moderateScale(120),
  },
});
