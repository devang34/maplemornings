import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const Onboarding = () => {
  const logoPosition = useRef(new Animated.ValueXY({ 
    x: width/2 - moderateScale(55), 
    y: height/2 - moderateScale(55)
  })).current;
  const logoScale = useRef(new Animated.Value(1.5)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Wait for 1 second before starting animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoPosition, {
          toValue: { x: moderateScale(11), y: moderateScale(20) },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowContent(true);
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Logo */}
      <Animated.Image
        source={require("../../assets/images/assets/logo.png")}
        style={[
          styles.logo,
          {
            transform: [
              { translateX: logoPosition.x },
              { translateY: logoPosition.y },
              { scale: logoScale }
            ],
          },
        ]}
      />

      {/* Animated Content */}
      {showContent && (
        <Animated.View 
          style={[
            styles.contentContainer,
            { opacity: contentOpacity }
          ]}
        >
          {/* Title and Subtitle */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Your Diet,{"\n"}Your Way!</Text>
            <Text style={styles.subtitle}>
              Maple Mornings ensures {"\n"}every meal matches your dietary needs.
            </Text>

            {/* Gradient Separator Line */}
            <View style={styles.lineContainer}>
              {/* <LinearGradient
                colors={["#FFF", "rgba(255, 255, 255, 0.00)"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.line}
              /> */}
              <Image 
                source={require("../../assets/images/assets/line.png")}
                style={styles.line}
              />
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featureItem}>Personalized.</Text>
              <View style={styles.separator} />
              <Text style={styles.featureItem}>Safe.</Text>
              <View style={styles.separator} />
              <Text style={styles.featureItem}>Delicious.</Text>
            </View>
          </View>

          {/* Illustration */}
          <Image
            source={require("../../assets/images/assets/onboarding.png")}
            style={styles.illustration}
          />

          {/* Get Started Button */}
          <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)")}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F6D41",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(11),
  },
  logo: {
    width: moderateScale(110),
    height: moderateScale(110),
    resizeMode: "contain",
    position: 'absolute',
  },
  textContainer: {
    alignItems: "flex-start",
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(100),
  },
  title: {
    fontSize: moderateScale(40),
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
    marginBottom: moderateScale(10),
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsRegular",
    color: "#E2E2E2",
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(15),
    textAlign: "left",
  },
  lineContainer: {
    width: 294,
    height: 1,
    marginVertical: 10,
    overflow: 'hidden',
  },
  line: {
    flex: 1,
    width: '100%',
    objectFit: 'contain',
  },
  featuresContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  featureItem: {
    fontSize: moderateScale(16),
    fontFamily: "PoppinsMedium",
    color: "#FFFFFF",
    marginHorizontal: moderateScale(5),
  },
  separator: {
    width: moderateScale(20),
    height: moderateScale(1),
    backgroundColor: "#FFFFFF66",
    marginHorizontal: moderateScale(5),
  },
  illustration: {
    height: 450,
    width: 450,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#FFC72C",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(4),
    borderWidth: moderateScale(2),
    borderColor: "#FFFFFF",
    marginBottom: moderateScale(30),
  },
  buttonText: {
    color: "#000",
    fontSize: moderateScale(18),
    fontFamily: "PoppinsSemiBold",
  },
});

export default Onboarding;

