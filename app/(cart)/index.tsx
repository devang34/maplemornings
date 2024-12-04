import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getCart, removeCartItem } from "@/api/cart";
import useStore from "@/hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { Ionicons, Entypo } from "@expo/vector-icons";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useStore((state) => state.token);
  const [cartItems, setCartItems] = useState<
    {
      id: number;
      dish: {
        id: any;
        image: string;
        name: string;
        info: string;
        price: number;
      };
      quantity: number;
    }[]
  >([]);

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await getCart(token || "");
      setCartItems(res?.items || []);
    } catch (error) {
      // Toast.show({
      //   type: "error",
      //   text1: "Error",
      //   text2: "Failed to fetch the cart.",
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Remove an item from the cart
  const handleRemoveItem = async (id: number) => {
    try {
      await removeCartItem(id, token || "");
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      Toast.show({
        type: "success",
        text1: "Removed",
        text2: "Item removed from cart.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove item.",
      });
    }
  };

  // Refresh cart items
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart is empty",
        text2: "Add some items to your cart before placing an order.",
      });
      return;
    }

    router.push({
      pathname: "/(cart)/address",
      params: {
        cartItems: JSON.stringify(cartItems), // Pass cartItems as a JSON string
      },
    });
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator />
      </View>
    );

  const renderItem = ({ item }: any) => {
    const { dish, quantity, id } = item;

    return (
      <View style={styles.itemBox}>
        <Image
          source={{ uri: dish.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{dish.name}</Text>
          <Text style={styles.itemPrice}>
            ${dish.price} x {quantity}
          </Text>
          <Text style={styles.itemTotal}>
            Total: ${(dish.price * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(id)}
        >
          <Entypo name="trash" size={moderateScale(24)} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={moderateScale(20)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.emptyButton} />
      </View>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.back()}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.orderContainer}>
          <TouchableOpacity
            style={[styles.orderButton, loading && styles.disabledButton]}
            onPress={handleOrderNow}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.orderButtonText}>Order Now</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: moderateScale(16),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: moderateScale(16),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  backButton: {
    backgroundColor: "#0F6D41",
    padding: moderateScale(5),
    borderRadius: moderateScale(8),
  },
  emptyButton: {
    backgroundColor: "transparent",
    padding: moderateScale(5),
  },
  listContent: {
    paddingBottom: moderateScale(16),
  },
  itemBox: {
    flexDirection: "row",
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    gap: moderateScale(8),
    borderColor: "#E7E7E7",
    alignItems: "center",
    padding: moderateScale(8),
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(80),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(15),
    marginBottom: moderateScale(4),
    fontFamily: "PoppinsSemiBold",
  },
  itemPrice: {
    fontSize: moderateScale(13),
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  itemTotal: {
    fontSize: moderateScale(14),
    color: "#000",
    fontFamily: "PoppinsRegular",
  },
  removeButton: {
    padding: moderateScale(8),
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: moderateScale(18),
    color: "#555",
    marginBottom: moderateScale(16),
    fontFamily: "PoppinsRegular",
  },
  shopNowButton: {
    backgroundColor: "#D9534F",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(8),
  },
  shopNowText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
  orderContainer: {
    paddingVertical: moderateScale(32),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  orderButton: {
    backgroundColor: "#0F6D41",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(4),
    alignItems: "center",
    width: "100%",
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
