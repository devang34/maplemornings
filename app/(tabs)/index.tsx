import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import FoodCard from "@/components/Card/FoodCard";
import PromoBanner from "@/components/Card/OfferCard";
import { moderateScale } from "@/utils/spacing";
import useStore from "@/hooks/useStore";
import { getDishByDiseases } from "@/api/diseases";
import Toast from "react-native-toast-message";
import { router, useFocusEffect } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getAllCoupons } from "@/api/coupon";
import { Coupon } from "@/interfaces";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocalSvg } from "react-native-svg/css";

interface Item {
  id: number;
  name: string;
  image: string;
  info: string;
  meals: string;
  price: string;
  restaurantName: string;
  calorie: string;
  isFavorite: boolean;
}

const { width } = Dimensions.get("screen");

export default function Dashboard() {
  const diseaseId = useStore((state) => state.disease);
  const username = useStore((state) => state.username);
  const token = useStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dishes, setDishes] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const removeToken = useStore((state) => state.removeToken);
  const setDisease = useStore((state) => state.setDisease);
  const setUsername = useStore((state) => state.setUsername);
  const resetIsVerified = useStore((state) => state.resetIsVerified);
  const [filteredDishes, setFilteredDishes] = useState<Item[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      if (token && diseaseId) {
        const res = await getDishByDiseases(diseaseId, token || "");
        setDishes(res);
        setFilteredDishes(res);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(lowerCaseQuery) ||
        dish.restaurantName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredDishes(filtered);
  };

  const fetchCoupons = async () => {
    try {
      if (token && diseaseId) {
        const data = await getAllCoupons(token || "");
        setCoupons(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDishes();
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

  useFocusEffect(
    useCallback(() => {
      // Fetch data when the screen is focused
      fetchDishes();
      fetchCoupons();
    }, [diseaseId, token])
  );

  const renderItem = ({ item, index }: any) => (
    <PromoBanner
      imageSource={
        index % 2 === 0
          ? require("../../assets/images/deal.png") // First image
          : require("../../assets/images/deal1.png")
      } // Second image
      promoText={item.code}
      promoTextColor={index % 2 === 0 ? "#fff" : "#000"}
      orderButtonBg={index % 2 === 0 ? "#FFC72C" : "#0F6D41"}
      promoDiscount={item.discountPercentage}
    />
  );

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: "#0F6D41",
              padding: 10,
              borderRadius: 4,
              alignItems: "center",
            }}
          >
            <LocalSvg
              asset={require("../../assets/images/map.svg")}
              width={16}
              height={16}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                {
                  fontSize: 10,
                  color: "#606060",
                  fontFamily: "PoppinsRegular",
                },
              ]}
            >
              Current Location
            </Text>
            <Text
              style={[
                {
                  fontSize: 12,
                  color: "#101010",
                  fontFamily: "PoppinsSemiBold",
                },
              ]}
            >
              Canada
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#F5F5F5",
            padding: 10,
            borderRadius: 4,
            alignItems: "center",
          }}
          onPress={() => router.push("/cart")}
        >
          <LocalSvg
            asset={require("../../assets/images/shopping-cart.svg")}
            width={16}
            height={16}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: moderateScale(100),
          paddingTop: moderateScale(10),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 45,
            gap: 10,
            borderColor: "#878787",
            borderWidth: 1,
            borderRadius: 5,
            margin: 10,
            padding: 10,
          }}
        >
          <Feather name="search" size={18} color="#878787" />
          <TextInput
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: 14,
              paddingTop: 3,
              color: "#878787",
              flex: 1,
            }}
            placeholderTextColor={"#878787"}
            placeholder="Search menu, restaurant or etc"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text)}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, {username}!</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginBottom: moderateScale(20),
              height: moderateScale(110),
            }}
          >
            <Carousel
              style={{ width: "100%", height: moderateScale(150) }}
              data={coupons}
              renderItem={renderItem}
              width={width}
              height={moderateScale(130)}
              // pagingEnabled
              snapEnabled
              autoPlay={false} // Disable autoplay for debugging
              loop={false}
            />
          </View>

          <Text style={styles.sortedTitle}>Sorted for you!</Text>
        </View>

        <View style={styles.cardContainer}>
          {filteredDishes.map((item) => (
            <FoodCard
              key={item.id}
              id={item.id}
              name={item.name}
              restaurantName={item.restaurantName}
              image={item.image}
              calorie={item.calorie}
              price={item.price}
              isFavorite={item.isFavorite}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
  },
  locationContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    alignItems: "center",
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: "PoppinsLight",
    color: "#fff",
  },
  content: {
    paddingHorizontal: moderateScale(15),
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: moderateScale(15),
  },
  welcomeText: {
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
  },
  logoutButton: {
    padding: moderateScale(10),
    backgroundColor: "#F5F5F5",
    borderRadius: moderateScale(5),
  },
  sortedTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(15),
  },
  detailsTitle: {
    fontFamily: "PoppinsBold",
    fontSize: moderateScale(24),
    color: "#333333",
    marginBottom: moderateScale(20),
  },
  detailsSubtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    color: "#666666",
    marginBottom: moderateScale(10),
  },
  detailsText: {
    fontFamily: "PoppinsRegular",
    fontSize: moderateScale(14),
    color: "#333333",
    marginBottom: moderateScale(10),
  },
});
