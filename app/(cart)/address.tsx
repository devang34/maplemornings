import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { IcBack } from "@/components/icons";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { moderateScale } from "@/utils/spacing";
import { createOrder, confirmOrder } from "@/api/order";
import useStore from "@/hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { clearCart } from "@/api/cart";
import { validateCoupon } from "@/api/coupon";

const AddressPage = () => {
  const { cartItems } = useLocalSearchParams();
  let parsedCartItems: any[] = [];
  let totalPrice = 0;

  try {
    if (cartItems) {
      parsedCartItems =
        typeof cartItems === "string" && cartItems.trim().startsWith("[")
          ? JSON.parse(cartItems)
          : [];
      // Calculate the total price
      totalPrice = parsedCartItems.reduce(
        (sum, item) => sum + item.dish.price * item.quantity,
        0
      );
    }
  } catch (error) {
    parsedCartItems = [];
  }

  // console.log("Parsed Cart Items:", parsedCartItems);

  const token = useStore((state) => state.token);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleValidateCoupon = async () => {
    if (!couponCode) {
      Toast.show({
        type: "error",
        text1: "Enter a Coupon Code",
        text2: "Please enter a coupon code to validate.",
      });
      return;
    }

    try {
      const response = await validateCoupon(couponCode, token || "");
      console.log(response);
      const { discountPercentage, maxDiscountAmount } = response.coupon;
      console.log(discountPercentage, maxDiscountAmount);
      const calculatedDiscount = Math.min(
        (totalPrice * discountPercentage) / 100,
        maxDiscountAmount
      );
      setDiscountAmount(calculatedDiscount);

      Toast.show({
        type: "success",
        text1: "Coupon Applied",
        text2: `Discount: $${calculatedDiscount.toFixed(2)}`,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Invalid Coupon",
        text2: error.response?.data?.error || "Failed to validate coupon.",
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !pincode) {
      Toast.show({
        type: "error",
        text1: "Address and Pincode Required",
        text2: "Please fill in both address and pincode to proceed.",
      });
      return;
    }

    if (!Array.isArray(parsedCartItems) || parsedCartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart is Empty",
        text2: "No items found in the cart to place an order.",
      });
      return;
    }

    setLoading(true);
    try {
      const items = parsedCartItems.map((item: any) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
      }));

      const data = { items, pincode, address, couponCode: couponCode || null };
      // console.log(data, "Order Data");

      // Create the order
      const response = await createOrder(data, token || "");

      if (response?.clientSecret) {
        Toast.show({
          type: "success",
          text1: "Order Created",
          text2: "Proceeding to payment...",
        });

        // Initialize the Stripe payment sheet
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: response.clientSecret,
          merchantDisplayName: "Maple Mornings",
        });

        if (initError) {
          Toast.show({
            type: "error",
            text1: "Payment Error",
            text2: "Failed to initialize the payment sheet.",
          });
          return;
        }

        // Present the payment sheet to the user
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          Toast.show({
            type: "error",
            text1: paymentError.code,
            text2: paymentError.message,
          });
        } else {
          Toast.show({
            type: "success",
            text1: "Payment Successful",
            text2: "Your order has been placed.",
          });

          // Confirm the order on the backend
          const paymentIntentId = response.clientSecret.split("_secret_")[0];
          const confirmResponse = await confirmOrder(
            paymentIntentId,
            token || ""
          );

          console.log("Order Confirmation:", confirmResponse);

          await clearCart(token || "");

          // Redirect the user to a confirmation page or reset navigation
          router.replace("/(tabs)/order");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error Creating Order",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to place order.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemCard}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}>{item.dish.name}</Text>
        <Text style={styles.itemText}>
          {item.quantity} x ${item.dish.price}
        </Text>
        <Text style={styles.itemText}>
          Total: ${(item.quantity * item.dish.price).toFixed(2)}
        </Text>
      </View>
      <Image
        source={{ uri: item.dish.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IcBack />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Address</Text>
        <View style={styles.emptyButton} />
      </View>
      <View style={styles.couponSection}>
        <TextInput
          placeholder="Enter Coupon Code"
          style={styles.couponInput}
          value={couponCode}
          onChangeText={setCouponCode}
        />
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleValidateCoupon}
        >
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={parsedCartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          Total Price: ${totalPrice.toFixed(2)}
        </Text>
        {discountAmount > 0 && (
          <Text style={styles.discountText}>
            Discount Applied: -${discountAmount.toFixed(2)}
          </Text>
        )}
        <Text style={styles.finalPriceText}>
          Final Price: ${(totalPrice - discountAmount).toFixed(2)}
        </Text>
      </View>
      <TextInput
        placeholder="Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Pincode"
        style={styles.input}
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.orderButton, loading && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        <Text style={styles.orderButtonText}>
          {loading ? "Placing Order..." : "Place Order"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddressPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: moderateScale(16),
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
  summaryCard: {
    backgroundColor: "#f8f8f8",
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  summaryText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: moderateScale(16),
  },
  itemCard: {
    flexDirection: "row", // Layout for item and image
    backgroundColor: "#fff",
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  itemText: {
    fontSize: moderateScale(16),
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
  },
  orderButton: {
    backgroundColor: "#D9534F",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  itemDetails: {
    flex: 1, // Take remaining space
    marginRight: moderateScale(8), // Add space between text and image
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(8),
    backgroundColor: "#f0f0f0",
  },
  couponSection: {
    flexDirection: "row",
    marginBottom: moderateScale(16),
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginRight: moderateScale(8),
  },
  verifyButton: {
    backgroundColor: "#4CAF50",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  discountText: {
    color: "#E76F51",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  finalPriceText: {
    fontWeight: "bold",
    fontSize: moderateScale(18),
  },
});
