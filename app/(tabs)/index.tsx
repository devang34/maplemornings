import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import FoodCard from "@/components/Card/FoodCard";
import PromoBanner from "@/components/Card/OfferCard";
import { moderateScale } from "@/utils/spacing";

const data = [
  {
    id: "1",
    title: "Sushi",
    description: "Japanese | Sushi Eats | 300-400gm cal",
    image: require("../../assets/images/assets/sussi.png"),
    isFeatured: true,
  },
  {
    id: "2",
    title: "Garlic Bread",
    description: "Italian | Bread Delight | 150-200gm cal",
    image: require("../../assets/images/assets/apple.png"),
    isFeatured: false,
  },
  {
    id: "3",
    title: "Apples",
    description: "Fruit | Healthy Snack | 50-70gm cal",
    image: require("../../assets/images/assets/sussi.png"),
    isFeatured: true,
  },
  {
    id: "4",
    title: "Baked Spicy Chicken",
    description: "Spicy Delight | Chicken Eats | 300-400gm cal",
    image: require("../../assets/images/assets/apple.png"),
    isFeatured: false,
  },
  {
    id: "5",
    title: "Oat Meals",
    description: "Healthy Breakfast | 200-300gm cal",
    image: require("../../assets/images/assets/sussi.png"),
    isFeatured: true,
  },
  {
    id: "6",
    title: "Kivi Juice",
    description: "Refreshing Drink | 100-150gm cal",
    image: require("../../assets/images/assets/apple.png"),
    isFeatured: false,
  },
];

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={require("../../assets/images/assets/home page top.png")}
        style={styles.topImage}
      >
        <Text style={styles.title}>Maple Mornings</Text>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, Devang!</Text>

        <PromoBanner />

        <Text style={styles.sortedTitle}>Sorted for you!</Text>

        <FlatList
          data={data}
          renderItem={({ item }) => (
            <FoodCard
              title={item.title}
              description={item.description}
              image={item.image}
              isFeatured={item.isFeatured}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false} // Disable FlatList scrolling as ScrollView will handle it
          contentContainerStyle={styles.cardList}
          showsVerticalScrollIndicator={false} // Hide FlatList scroll indicator
        />

        <Text style={styles.seeMoreText}>see more</Text>
      </View>
    </ScrollView>
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
  promoBanner: {
    backgroundColor: "#FAE2A4",
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    alignItems: "center",
    marginBottom: moderateScale(15),
  },
  promoText: {
    fontSize: moderateScale(14),
    color: "#333",
  },
  promoDiscount: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#E76F51",
  },
  orderButton: {
    marginTop: moderateScale(10),
    backgroundColor: "#E76F51",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(5),
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: moderateScale(1),
    backgroundColor: "#333",
    marginVertical: moderateScale(15),
    alignSelf: "center",
    width: "80%",
  },
  sortedTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: moderateScale(10),
  },
  cardList: {
    alignItems: "center",
  },
  seeMoreText: {
    textAlign: "right",
    fontSize: moderateScale(14),
    color: "#000",
    textDecorationLine: "underline",
    fontFamily: "PoppinsMedium",
    marginBottom: moderateScale(20),
  },
});
