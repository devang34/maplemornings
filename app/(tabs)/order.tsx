import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import useStore from "@/hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllOrder } from "@/api/order"; // import your API call
import { Order } from "@/interfaces";
import { moderateScale } from "@/utils/spacing";

const dishImage = require("../../assets/images/assets/dish1.png");

const OrderPage = () => {
  const token = useStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  const fetchOrders = async () => {
    try {
      const data = await getAllOrder(token || "");
      setOrders(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true); // Show the refresh indicator
    await fetchOrders();
  };

  const Header = () => {
    return <Text style={styles.header}>Your Orders</Text>;
  };

  const renderItem = ({ item }: { item: Order }) => {
    const { createdAt, quantity, totalAmount, dish }: Order = item;
    return (
      
      <View style={styles.orderItem}>
        <Image
          source={
            typeof dish.image === "string" &&
            dish.image.startsWith("data:image")
              ? { uri: dish.image }
              : typeof dish.image === "string"
              ? { uri: dish.image }
              : dishImage
          }
          style={styles.dishImage}
        />
        <View style={{ ...styles.detailsContainer, gap: moderateScale(4, 2) }}>
          <Text numberOfLines={1} style={{ ...styles.dishName }}>
            {dish.name}
          </Text>
          <Text style={styles.orderDetails}>Qty: {quantity}</Text>
        </View>
        <View style={{ gap: moderateScale(4, 2) }}>
          <Text style={styles.orderDetails}>${totalAmount.toFixed(2)}</Text>
          <Text style={styles.date}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={orders}
          ListHeaderComponent={Header}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No orders found.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: moderateScale(16),
  },
  header: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: moderateScale(20),
    color: "#333",
  },
  loading: {
    textAlign: "center",
    marginTop: moderateScale(20),
    fontSize: moderateScale(18),
    color: "#999",
  },
  listContainer: {
    paddingBottom: moderateScale(64),
  },
  orderItem: {
    backgroundColor: "#FFF",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginVertical: moderateScale(8),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dishImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(12),
  },
  detailsContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
  },
  orderDetails: {
    fontSize: moderateScale(14),
    color: "#666",
  },
  date: {
    fontSize: moderateScale(12),
    color: "#888",
    marginTop: moderateScale(4),
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: moderateScale(20),
    fontSize: moderateScale(16),
    color: "#999",
  },
});

export default OrderPage;
