import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import FoodCard from "@/components/Card/FoodCard";
import PromoBanner from "@/components/Card/OfferCard";
import { moderateScale } from "@/utils/spacing";
import useStore from "@/hooks/useStore";
import { getDishByDiseases } from "@/api/diseases";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { getAllCoupons } from "@/api/coupon";
import { Coupon } from "@/interfaces";

interface Item {
  id: number;
  name: string;
  image: string;
  info: string;
  meals: string;
  price: string;
}

export default function Dashboard() {
  const diseaseId = useStore((state) => state.disease);
  const username = useStore((state) => state.username);
  const token = useStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For refresh control
  const [dishes, setDishes] = useState([]);
  const removeToken = useStore((state) => state.removeToken);
  const setDisease = useStore((state) => state.setDisease);
  const setUsername = useStore((state) => state.setUsername);
  const resetIsVerified = useStore((state) => state.resetIsVerified);
  const [coupons, setCoupons] = useState<Coupon>();

  const fetchDishes = async () => {
    setLoading(true);
    try {
      if (token && diseaseId) {
        const res = await getDishByDiseases(diseaseId, token || "");
        setDishes(res);
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error Fetching Dish",
        text2: err.response?.data?.error || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      if (token && diseaseId) {
        const data = await getAllCoupons(token || "");
        setCoupons(data[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDishes(); // Re-fetch dishes
    await fetchCoupons();
    setRefreshing(false);
  };

  const handleLogout = () => {
    removeToken();
    setDisease("");
    resetIsVerified();
    setUsername("");
    router.push("/(auth)");
  };

  useEffect(() => {
    fetchDishes();
    fetchCoupons();
  }, [diseaseId, token]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ImageBackground
          source={require("../../assets/images/assets/home page top.png")}
          style={styles.topImage}
        >
          <Text style={styles.title}>Maple Mornings</Text>
        </ImageBackground>

        <View style={styles.content}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                width: moderateScale(40),
                height: moderateScale(40),
                backgroundColor: "#00000011",
                borderRadius: moderateScale(200),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="logout" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {coupons && (
            <PromoBanner
              code={coupons?.code}
              discount={coupons?.discountPercentage}
            />
          )}
          <Text style={styles.sortedTitle}>Sorted for you!</Text>

          <FlatList
            data={dishes}
            renderItem={({ item }: { item: Item }) => (
              <FoodCard
                title={item.name}
                description={item.info}
                image={item.image}
                isFeatured={true}
                dish={item}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.cardList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: moderateScale(94),
          right: moderateScale(16),
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(cart)")}
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            backgroundColor: "#00000011",
            borderRadius: moderateScale(200),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="shopping-cart" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topImage: {
    width: "100%",
    height: moderateScale(250),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: "PoppinsLight",
    color: "#fff",
    position: "absolute",
    top: moderateScale(50),
  },
  content: {
    paddingHorizontal: moderateScale(15),
    position: "relative",
    top: moderateScale(-70),
  },
  welcomeText: {
    fontSize: moderateScale(20),
    fontFamily: "PoppinsSemiBold",
    marginVertical: moderateScale(15),
  },
  sortedTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
  },
  cardList: {},
});
