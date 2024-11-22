import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import useStore from "@/hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import PromoBanner from "@/components/Card/OfferCard";
import { moderateScale } from "@/utils/spacing";
import { getAllCoupons } from "@/api/coupon";
import { Coupon } from "@/interfaces";

const Deals = () => {
  const token = useStore((state) => state.token);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCoupons = async () => {
    try {
      const data = await getAllCoupons(token || "");
      setCoupons(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCoupons();
  };

  const Header = () => <Text style={styles.header}>Deals</Text>;

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
    <SafeAreaView style={{ width: "100%" }}>
      <FlatList
        data={coupons}
        ListHeaderComponent={Header}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: moderateScale(24) }}>
            <PromoBanner code={item.code} discount={item.discountPercentage} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No deals available.</Text>
        }
        refreshing={refreshing}
        onRefresh={onRefresh} // Handle the pull-to-refresh action
      />
    </SafeAreaView>
  );
};

export default Deals;

const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: "center",
    marginTop: moderateScale(20),
    fontSize: moderateScale(16),
    color: "#999",
  },
  header: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: moderateScale(20),
    color: "#333",
  },
  listContainer: {
    paddingBottom: moderateScale(64),
    height: "100%",
  },
});
