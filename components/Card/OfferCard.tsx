import { moderateScale } from "@/utils/spacing";
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
} from "react-native";

export default function PromoBanner({
  imageSource,
  promoText,
  promoTextColor,
  orderButtonBg,
  promoDiscount,
}: any) {
  return (
    <ImageBackground
      source={imageSource}
      style={styles.promoBanner}
      imageStyle={styles.promoImage}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.promoText, { color: promoTextColor }]}>
          Use {promoText} to get
        </Text>
        {promoDiscount && (
          <Text style={[styles.promoDiscount, { color: promoTextColor }]}>
            {promoDiscount}% discount
          </Text>
        )}
        <View
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <Pressable
            style={[styles.orderButton, { backgroundColor: orderButtonBg }]}
          >
            <Text style={styles.orderButtonText}>Order Now</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    borderRadius: moderateScale(5),
    padding: moderateScale(15),
    flexDirection: "row",
    alignItems: "center",
    height: moderateScale(110),
    width: "100%",
    justifyContent: "space-between",
    marginBottom: moderateScale(10), // Decreased margin bottom
  },
  textContainer: {
    flex: 1,
  },
  promoText: {
    fontSize: moderateScale(16),
    width: "60%",
    fontFamily: "PoppinsSemiBold",
  },
  promoDiscount: {
    fontSize: moderateScale(15),
    fontFamily: "PoppinsBold",
  },
  orderButton: {
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(30),
  },
  orderButtonText: {
    fontFamily: "PoppinsMedium",
    color: "#000",
    fontSize: moderateScale(10),
  },
  promoImage: {
    borderRadius: moderateScale(5),
    objectFit: "cover",
    width: "100%",
  },
});
