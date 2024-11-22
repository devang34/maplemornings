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
import { IcBack } from "@/components/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { Entypo } from "@expo/vector-icons";

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
          <Entypo name="trash" size={24} color="#ff4d4d" />
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
          <IcBack />
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
    fontWeight: "bold",
    marginLeft: moderateScale(8),
  },
  backButton: {
    backgroundColor: "black",
    opacity: 0.5,
    padding: moderateScale(4),
    borderRadius: moderateScale(120),
  },
  emptyButton: {
    backgroundColor: "white",
    opacity: 0.5,
    padding: moderateScale(4),
    borderRadius: moderateScale(120),
  },
  listContent: {
    paddingBottom: moderateScale(16),
  },
  itemBox: {
    flexDirection: "row",
    marginBottom: moderateScale(16),
    backgroundColor: "#f8f8f8",
    borderRadius: moderateScale(8),
    overflow: "hidden",
    elevation: 1,
    alignItems: "center",
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(80),
  },
  itemDetails: {
    flex: 1,
    padding: moderateScale(8),
  },
  itemName: {
    fontWeight: "bold",
    fontSize: moderateScale(16),
    marginBottom: moderateScale(4),
  },
  itemPrice: {
    fontSize: moderateScale(14),
    color: "#333",
  },
  itemTotal: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#000",
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
  },
  orderButton: {
    backgroundColor: "#D9534F",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(8),
    alignItems: "center",
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
