import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dish } from "@/interfaces";

interface FoodCardProps {
  title: string;
  description: string;
  image: any; // Replace 'any' with the specific type if known
  isFeatured: boolean;
  price?: string;
  mealTiming?: string; // e.g., "Breakfast", "Lunch", "Dinner"
  dish: Dish;
}

const screenWidth = Dimensions.get("window").width;

export default function FoodCard({
  title,
  description,
  image,
  isFeatured,
  dish,
}: FoodCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFeatured);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCardPress = () => {
    router.push({
      pathname: "/details",
      params: {
        dish: JSON.stringify(dish),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handleCardPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../../assets/images/assets/sussi.png")
          }
          style={styles.cardImage}
        />

        <TouchableOpacity
          onPress={handleFavoriteToggle}
          style={styles.favoriteIcon}
        >
          <FontAwesome
            name="star"
            size={12}
            color={isFavorite ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {title}
      </Text>
      <Text numberOfLines={2} style={styles.cardDescription}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 6,
    position: "relative",
    alignItems: "flex-start",
    width: screenWidth / 3 - 20, // Width adjusted for three columns with padding
  },
  imageContainer: {
    width: "100%",
    height: 80,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 80,
    borderRadius: 6,
  },
  favoriteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    textAlign: "left",
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 9,
    fontFamily: "PoppinsMedium",
    color: "#6F6F6F",
    textAlign: "left",
  },
});
