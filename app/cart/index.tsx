import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { moderateScale } from "@/utils/spacing";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { clearCart, getCart, removeCartItem } from "@/api/cart";
import useStore from "@/hooks/useStore";
import Toast from "react-native-toast-message";
import { confirmOrder, createOrder } from "@/api/order";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { validateCoupon } from "@/api/coupon";

interface Dish {
  cartId: number;
  dish: {
    calorie: string;
    id: number;
    image: string;
    info: string;
    meals: string;
    name: string;
    price: string;
    refrence: string;
    restaurantName: string;
  };
  dishId: number;
  id: number;
  quantity: number;
}

interface CartCardProps {
  dish: Dish;
  handleRemoveItem: () => void;
}

const CartCard: React.FC<CartCardProps> = ({ dish, handleRemoveItem }) => {
  console.log(dish);
  const totalPrice = Math.max(
    0,
    parseFloat(dish.dish.price) * dish.quantity - 4
  ).toFixed(2);
  return (
    <View style={styles.itemBox}>
      <Image
        source={require("../../assets/images/assets/dish1.png")}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text numberOfLines={1} style={styles.itemName}>
          {dish.dish.name}
        </Text>
        <Text style={styles.itemPrice}>{dish.quantity} ITEM</Text>
        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>${totalPrice}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveItem}
          >
            <Entypo name="trash" size={moderateScale(24)} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<Dish[]>();
  const [couponCode, setCouponCode] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const token = useStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [placeLoading, setPlaceLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await getCart(token || "");
      setCartItems(res?.items || []);
      console.log(res.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const handleRemoveItem = async (id: number) => {
    try {
      await removeCartItem(id, token || "");
      setCartItems((prev) => prev?.filter((item) => item.id !== id));
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

  const handlePlaceOrder = async () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart is Empty",
        text2: "No items found in the cart to place an order.",
      });
      return;
    }

    if (!address || !zipCode) {
      Toast.show({
        type: "error",
        text1: "Address and Pincode Required",
        text2: "Please fill in both address and pincode to proceed.",
      });
      return;
    }

    try {
      setPlaceLoading(true);
      const items = cartItems.map((item: any) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
      }));

      const data = {
        items,
        pincode: zipCode,
        address,
        couponCode: couponCode || null,
      };
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
      setPlaceLoading(false);
    }
  };

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
      const { discountPercentage, maxDiscountAmount } = response.coupon;

      const calculatedDiscount = Math.min(
        (subtotal * discountPercentage) / 100,
        maxDiscountAmount
      );

      setDiscountAmount(calculatedDiscount);

      Toast.show({
        type: "success",
        text1: "Coupon Applied",
        text2: `Discount: $${calculatedDiscount.toFixed(2)}`,
      });
    } catch (error: any) {
      setDiscountAmount(0); // Reset discount on error
      Toast.show({
        type: "error",
        text1: "Invalid Coupon",
        text2: error.response?.data?.error || "Failed to validate coupon.",
      });
    }
  };

  const deliveryCharge = 0.0;
  const taxes = 0.0;

  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + parseFloat(item.dish.price) * item.quantity;
    }, 0) || 0;

  // Calculate grand total
  const grandTotal = subtotal + deliveryCharge + taxes - discountAmount;

  if (loading)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator />
      </View>
    );

  if (cartItems?.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: moderateScale(16) }}>Cart is Empty!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {cartItems &&
            cartItems.map((item) => (
              <CartCard
                key={item.id}
                dish={item}
                handleRemoveItem={() => handleRemoveItem(item.id)}
              />
            ))}

          <View style={styles.couponContainer}>
            <Text style={styles.sectionTitle}>Coupon Code</Text>
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Type Coupon Code here"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity
                onPress={handleValidateCoupon}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderWidth: 0.8,
              borderBottomWidth: 0,
              borderRadius: moderateScale(8),
              borderColor: "#D9D9D9",
              marginBottom: moderateScale(10),
            }}
          >
            <View style={styles.billContainer}>
              <Text style={styles.sectionTitle}>Bill Details</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Sub Total</Text>
                <Text style={styles.billAmount}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Charge</Text>
                <Text style={styles.billAmount}>
                  ${deliveryCharge.toFixed(2)}
                </Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Taxes</Text>
                <Text style={styles.billAmount}>${taxes.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Discount</Text>
                <Text style={styles.billAmount}>
                  -${discountAmount.toFixed(2)}
                </Text>
              </View>
              <Image
                source={require("../../assets/images/dotted.png")}
                style={{
                  width: "100%",
                  height: 1,
                  marginBottom: moderateScale(12),
                  marginTop: moderateScale(4),
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={[styles.billRow1, styles.totalRow]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalAmount}>${grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Address</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={styles.zipContainer}>
            <Text style={styles.sectionTitle}>ZIP Code</Text>
            <TextInput
              style={styles.zipInput}
              placeholder="Enter ZIP code"
              value={zipCode}
              onChangeText={setZipCode}
            />
          </View>
        </ScrollView>
        {placeLoading ? (
          <View style={styles.placeOrderButton}>
            <ActivityIndicator size={moderateScale(16)} color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={handlePlaceOrder}
            style={styles.placeOrderButton}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    gap: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  removeButton: {
    padding: moderateScale(8),
  },
  backButton: {
    backgroundColor: "#0F6D41",
    padding: moderateScale(5),
    borderRadius: moderateScale(4),
  },
  emptyButton: {
    backgroundColor: "transparent",
    padding: moderateScale(5),
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  itemBox: {
    flexDirection: "row",
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    gap: moderateScale(8),
    borderColor: "#D9D9D9",
    alignItems: "center",
    padding: moderateScale(10),
  },
  itemImage: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(8),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: moderateScale(15),
    fontFamily: "PoppinsSemiBold",
  },
  itemPrice: {
    fontSize: moderateScale(13),
    color: "#8D8D8D",
    fontFamily: "PoppinsMedium",
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTotal: {
    fontSize: moderateScale(16),
    color: "#020202",
    fontFamily: "PoppinsSemiBold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(6),
  },
  quantityButton: {
    padding: moderateScale(4),
    width: moderateScale(30),
    alignItems: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
  quantityText: {
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    fontSize: moderateScale(16),
    paddingHorizontal: moderateScale(8),
  },
  couponContainer: {
    marginBottom: moderateScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
    marginBottom: moderateScale(8),
  },
  couponInputContainer: {
    flexDirection: "row",
    gap: moderateScale(8),
    borderWidth: 0.81,
    borderColor: "#C0C0C0",
    borderRadius: moderateScale(4),
    padding: moderateScale(8),
  },
  couponInput: {
    flex: 1,
    fontFamily: "PoppinsRegular",
    paddingLeft: moderateScale(5),
    fontSize: moderateScale(12),
  },
  applyButton: {
    backgroundColor: "#fff",
    paddingHorizontal: moderateScale(16),
    justifyContent: "center",
    borderRadius: moderateScale(4),
    borderWidth: 0.5,
    borderColor: "#8D8D8D",
  },
  applyButtonText: {
    color: "#8D8D8D",
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(10),
  },
  billContainer: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(16),

    marginBottom: moderateScale(10),
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(8),
  },
  billRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billLabel: {
    fontSize: moderateScale(14),
    color: "#8D8D8D",
    fontFamily: "PoppinsRegular",
  },
  billAmount: {
    fontSize: moderateScale(14),
    color: "#000",
    fontFamily: "PoppinsMedium",
  },
  dottedLine: {
    width: "100%",
    height: 1,
    marginBottom: moderateScale(12),
    marginTop: moderateScale(4),
    resizeMode: "contain",
  },
  totalRow: {
    borderWidth: 1,
    borderColor: "#0F6D41",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    backgroundColor: "#E0F9EB",
    borderRadius: moderateScale(8),
  },
  totalLabel: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
  totalAmount: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
    color: "#0F6D41",
  },
  addressContainer: {
    marginBottom: moderateScale(20),
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: moderateScale(4),
    padding: moderateScale(8),
    paddingLeft: moderateScale(13),
    minHeight: moderateScale(80),
    textAlignVertical: "top",
    fontFamily: "PoppinsRegular",
  },
  zipContainer: {
    marginBottom: moderateScale(100),
  },
  zipInput: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: moderateScale(4),
    padding: moderateScale(8),
    paddingLeft: moderateScale(13),
    fontFamily: "PoppinsRegular",
  },
  placeOrderButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0F6D41",
    padding: moderateScale(16),
    marginHorizontal: moderateScale(16),
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsSemiBold",
  },
});
