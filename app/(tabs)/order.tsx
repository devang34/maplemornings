import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "@/components/Card/OrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "@/utils/spacing";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useStore from "@/hooks/useStore";
import { getAllOrder } from "@/api/order";

interface Order {
  address: string;
  couponId: string;
  createdAt: string;
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
  paymentMethod: null;
  paymentStatus: string;
  pincode: string;
  quantity: number;
  status: string;
  totalAmount: number;
  updatedAt: string;
  userId: number;
}

const Order = () => {
  const token = useStore((state) => state.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrder(token || "");
      setOrders(data);
      console.log(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchOrders();
      }
    }, [token])
  );

  const onRefresh = async () => {
    setRefreshing(true); // Show refreshing indicator
    await fetchOrders();
    setRefreshing(false); // Hide refreshing indicator
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View></View>
        <Text style={styles.headerTitle}>Your Orders</Text>
        <View></View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length > 0 ? (
          orders.map((item, index) => (
            <ProductCard
              key={index}
              id={item.id}
              title={item.dish.name}
              totalAmount={item.totalAmount}
              date={item.createdAt}
              quantity={item.quantity}
              image={item.dish.image}
              onPress={() => console.log("first")}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Order is empty</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    justifyContent: "space-between",
  },
  backButton: {
    padding: moderateScale(5),
    backgroundColor: "#0F6D41",
    borderRadius: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#000000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
    color: "#000000",
  },
});

const g = [
  {
    address: "hey",
    couponId: null,
    createdAt: "2024-12-04T07:07:49.362Z",
    dish: {
      calorie: "250",
      id: 10,
      image:
        "https://images.eatthismuch.com/img/54908_i_heart_tjs_39d3e859-3b25-4dcb-8bc2-1f2a5f7fac0e.jpg",
      info: "Approximately 250 calories, 20g carbohydrates, 5g sugars. A refreshing and nutrient-dense salad with creamy avocado and ripe tomatoes, rich in healthy fats and vitamins.",
      meals: "Lunch, Dinner, Snack",
      name: "Avocado and Tomato Salad",
      price: "10.00",
      refrence:
        "https://www.eatthismuch.com/calories/avocado-tomato-salad-54908",
      restaurantName: "Paramount Fine Foods",
    },
    dishId: 10,
    id: 11,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "T23333",
    quantity: 1,
    status: "CONFIRMED",
    totalAmount: 10,
    updatedAt: "2024-12-04T07:08:18.074Z",
    userId: 1,
  },
  {
    address: "hey",
    couponId: null,
    createdAt: "2024-12-04T07:07:49.355Z",
    dish: {
      calorie: "350",
      id: 11,
      image:
        "https://feelgoodfoodie.net/wp-content/uploads/2017/02/Chicken-and-Quinoa-Bowl-8.jpg",
      info: "Approximately 350 calories, 40g carbohydrates, 6g sugars. A balanced meal featuring lean grilled chicken and quinoa, providing a great source of protein and fiber.",
      meals: "Lunch, Dinner",
      name: "Grilled Chicken with Quinoa",
      price: "16.00",
      refrence: "https://feelgoodfoodie.net/recipe/chicken-quinoa-bowl/",
      restaurantName: "East Side Mario's",
    },
    dishId: 11,
    id: 10,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "T23333",
    quantity: 2,
    status: "CONFIRMED",
    totalAmount: 32,
    updatedAt: "2024-12-04T07:08:18.051Z",
    userId: 1,
  },
  {
    address: "Yeyw",
    couponId: null,
    createdAt: "2024-12-02T05:07:56.670Z",
    dish: {
      calorie: "400",
      id: 7,
      image:
        "https://natashaeatsplants.com/wp-content/uploads/2022/10/IMG_5808-1024x1024.jpg",
      info: "Approximately 400 calories, 70g carbohydrates, 8g sugars. A satisfying gluten-free pasta dish topped with a rich and flavorful tomato sauce, perfect for a light yet hearty meal.",
      meals: "Lunch, Dinner",
      name: "Gluten-Free Pasta with Tomato Sauce",
      price: "15.00",
      refrence:
        "https://natashaeatsplants.com/recipe/dinner/tomato-pasta-sauce-gluten-free-vegan/",
      restaurantName: "Freshii",
    },
    dishId: 7,
    id: 9,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "GSGS",
    quantity: 1,
    status: "CONFIRMED",
    totalAmount: 15,
    updatedAt: "2024-12-02T05:08:23.082Z",
    userId: 1,
  },
  {
    address: "Yeyw",
    couponId: null,
    createdAt: "2024-12-02T05:07:56.666Z",
    dish: {
      calorie: "400",
      id: 3,
      image:
        "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F1006752.jpg&q=60&c=sc&poi=auto&orient=true&h=512",
      info: "Approximately 400 calories, 35g carbohydrates, 8g sugars. A delicious and balanced stir-fry with lean chicken, colorful vegetables, and a flavorful sauce.",
      meals: "Lunch, Dinner",
      name: "Chicken and Vegetable Stir-Fry",
      price: "16.50",
      refrence:
        "https://www.allrecipes.com/recipe/231229/stir-fry-chicken-and-vegetables/",
      restaurantName: "The Keg Steakhouse & Bar",
    },
    dishId: 3,
    id: 8,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "GSGS",
    quantity: 1,
    status: "CONFIRMED",
    totalAmount: 16.5,
    updatedAt: "2024-12-02T05:08:23.079Z",
    userId: 1,
  },
  {
    address: "Ywywh",
    couponId: null,
    createdAt: "2024-12-02T05:07:08.830Z",
    dish: {
      calorie: "350",
      id: 8,
      image:
        "https://www.thissavoryvegan.com/wp-content/uploads/2023/08/bean-rice-burrito-bowls-3.jpg",
      info: "Approximately 350 calories, 60g carbohydrates, 5g sugars. A nutritious and filling bowl combining fiber-rich rice and beans, making it a balanced plant-based meal.",
      meals: "Lunch, Dinner",
      name: "Rice and Bean Bowl",
      price: "12.50",
      refrence: "https://www.thissavoryvegan.com/bean-rice-burrito-bowls/",
      restaurantName: "Mucho Burrito",
    },
    dishId: 8,
    id: 7,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "2562FWG",
    quantity: 1,
    status: "CONFIRMED",
    totalAmount: 12.5,
    updatedAt: "2024-12-02T05:07:29.491Z",
    userId: 1,
  },
  {
    address: "Ttt",
    couponId: null,
    createdAt: "2024-11-29T17:18:18.509Z",
    dish: {
      calorie: "350",
      id: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1664391919722-b5d05b5c366d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEdyaWxsZWQlMjBTYWxtb24lMjB3aXRoJTIwU3RlYW1lZCUyMEJyb2Njb2xpfGVufDB8fDB8fHww",
      info: "Approximately 350 calories, 10g carbohydrates, 5g sugars. A healthy, protein-packed meal with omega-3s and essential nutrients.",
      meals: "Lunch, Dinner",
      name: "Grilled Salmon with Steamed Broccoli",
      price: "22.50",
      refrence:
        "https://www.foodnetwork.com/recipes/food-network-kitchen/grilled-salmon-with-foil-pack-sesame-broccoli-5479043",
      restaurantName: "The Keg Steakhouse & Bar",
    },
    dishId: 1,
    id: 2,
    paymentMethod: null,
    paymentStatus: "COMPLETED",
    pincode: "21",
    quantity: 2,
    status: "CONFIRMED",
    totalAmount: 45,
    updatedAt: "2024-11-29T17:18:43.263Z",
    userId: 1,
  },
];
