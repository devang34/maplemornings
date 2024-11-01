import React, { useState } from "react";
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
import { useStripe } from "@stripe/stripe-react-native";

// Static import for the image to avoid dynamic require issues
const dishImage = require("../../assets/images/assets/dish1.png");

export default function FoodDetails() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // Dummy data for Roasted Carrots
  const foodItem = {
    name: "Roasted Carrots",
    info: "A beta-carotene-rich vegetable that supports lung health.",
    meals: "Dinner",
    price: "3.99",
    image: dishImage,
  };

  // Dummy client secret for testing (replace this with a real clientSecret for production)
  const dummyClientSecret = "pi_test_1GfWqW2eZvKYlo2CfLnYK27S_secret_lDIFJzEgMQlxOcMmTiUbX";

  const handleOrderNow = async () => {
    setLoading(true);
    try {
      // Step 1: Initialize the payment sheet with dummy client secret
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: dummyClientSecret,
        merchantDisplayName: "Healthy Eats",
      });

      if (error) {
        console.error("Payment sheet initialization error:", error);
        Alert.alert("Error", "Failed to initialize payment sheet.");
        return;
      }

      // Step 2: Present the payment sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      } else {
        Alert.alert("Success", "Your order has been placed!");
      }
    } catch (error) {
      console.error("Payment error:", error.message);
      Alert.alert("Error", "Failed to process the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={foodItem.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{foodItem.name}</Text>
        <Text style={styles.description}>{foodItem.info}</Text>
        <Text style={styles.price}>${foodItem.price}</Text>
        <Text style={styles.mealTiming}>Suitable for: {foodItem.meals}</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    paddingBottom: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "90%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    color: "#D9534F",
    marginBottom: 8,
  },
  mealTiming: {
    fontSize: 14,
    fontFamily: "PoppinsMedium",
    color: "#888",
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
});
