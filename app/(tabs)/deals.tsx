import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { moderateScale } from "@/utils/spacing";
import PromoBanner from "@/components/Card/OfferCard";
import useStore from "@/hooks/useStore";
import { getAllCoupons } from "@/api/coupon";
import { Coupon } from "@/interfaces";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("screen");

const Deals = () => {
  const token = useStore((state) => state.token);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons(token || "");
      console.log(data);
      setCoupons(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchCoupons();
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ width, flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={coupons}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.couponsHeader}>Coupons</Text>
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: moderateScale(14),
            }}
          >
            <PromoBanner
              imageSource={
                index % 2 === 0
                  ? require("../../assets/images/deal.png")
                  : require("../../assets/images/deal1.png")
              }
              promoText={item.code}
              promoTextColor={index % 2 === 0 ? "#fff" : "#000"}
              orderButtonBg={index % 2 === 0 ? "#FFC72C" : "#0F6D41"}
              promoDiscount={item.discountPercentage}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default Deals;

const styles = StyleSheet.create({
  header: {
    fontSize: moderateScale(24),
    textAlign: "center",
    marginVertical: moderateScale(20),
    color: "#333",
  },
  couponsHeader: {
    fontSize: moderateScale(20),
    textAlign: "center",
    marginBottom: moderateScale(10),
    color: "#000",
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: moderateScale(48),
    // height: "100%",
    width,
  },
});
