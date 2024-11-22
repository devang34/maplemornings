import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

export default function PromoBanner({ code, discount }: any) {
  return (
    <View style={styles.promoBanner}>
      <View style={styles.textContainer}>
        <Text style={styles.promoText}>Use code:</Text>
        <Text style={styles.promoDiscount}>{code}</Text>
        <Text style={styles.promoText}>Get {discount}% off</Text>
        <View
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <Pressable style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Apply Now</Text>
          </Pressable>
        </View>
      </View>

      {/* Image Section */}
      <Image
        source={require("../../assets/images/assets/offer.png")}
        style={styles.promoImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    backgroundColor: "#F5DF9D",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
  },
  promoText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },
  promoDiscount: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: "#E76F51",
  },
  orderButton: {
    marginTop: 10,
    backgroundColor: "#FF7043",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  orderButtonText: {
    fontFamily: "PoppinsSemiBold",
    color: "#fff",
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginLeft: 10,
  },
});
