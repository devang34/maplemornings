import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import Dropdown from "@/components/Dropdown";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { getAllDiseases, getDishByDisease } from "@/api/diseases";
import useStore from "@/hooks/useStore";
import Toast from "react-native-toast-message";

const { height } = Dimensions.get("window");

const DietaryForm: React.FC = () => {
  const [age, setAge] = useState<string>("");
  const [dietaryConcern, setDietaryConcern] = useState<string>("");
  const [diseaseOptions, setDiseaseOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [submitted, setSubmitted] = useState(false);
  const [expandedDish, setExpandedDish] = useState<number | null>(null); // Track expanded dish by index
  const [showDishes, setShowDishes] = useState(false);
  const [dishes, setDishes] = useState<
    Array<{
      id: number;
      name: string;
      image: string;
      info: string;
      meals: string;
      price: string;
    }>
  >([]);
  const token = useStore((state) => state.token);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const setDisease = useStore((state) => state.setDisease);

  const ageOptions = Array.from({ length: 100 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const handleSubmit = () => {
    if (!age || !dietaryConcern) {
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: "Select Age and Dietary Concern to proceed",
      });
      return;
    }
    getDishByDisease(age, dietaryConcern, token || "")
      .then((res) => {
        console.log(res);
        setDishes(res);
        setSubmitted(true);
        setIsVerified(true);
        setDisease(dietaryConcern);
      })
      .catch((err) => console.log(err));
  };

  const toggleDishDetails = (index: number) => {
    setExpandedDish(expandedDish === index ? null : index);
  };

  useEffect(() => {
    getAllDiseases(token || "")
      .then((res) => {
        const formattedOptions = res.map((disease) => ({
          label: disease.name,
          value: disease.id.toString(),
        }));
        setDiseaseOptions(formattedOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Background Image as Overlay */}
      <ImageBackground
        source={require("../assets/images/assets/top_bg.png")}
        style={styles.topImage}
      />

      {/* Scrollable Form Background */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../assets/images/assets/onboarding_bg.png")}
          style={styles.formBackground}
        >
          <View style={styles.contentContainer}>
            <View style={styles.formContainer}>
              {/* Home Button */}
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push("/(tabs)")}
              >
                <Text style={styles.homeButtonText}>Home</Text>
              </TouchableOpacity>

              {/* Logo */}
              <Image
                source={require("../assets/images/assets/logo.png")}
                style={styles.logo}
              />

              {/* Titles */}
              <Text style={styles.title}>
                Concerned for your{" "}
                <Text style={styles.highlight}>dietary restrictions?</Text>
              </Text>
              <Text style={styles.subtitle}>
                Maple Mornings{" "}
                <Text style={styles.highlightAlt}>got you covered!</Text>
              </Text>

              {!submitted ? (
                <>
                  {/* Age Dropdown */}
                  <Dropdown
                    label="Enter your age"
                    options={ageOptions}
                    selectedValue={age}
                    onValueChange={setAge}
                  />

                  {/* Dietary Concern Dropdown */}
                  <Dropdown
                    label="Choose the dietary concern"
                    options={diseaseOptions}
                    selectedValue={dietaryConcern}
                    onValueChange={setDietaryConcern}
                  />

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Only Dietary Concern Dropdown after submission */}
                  <Dropdown
                    label="Choose the dietary concern"
                    options={diseaseOptions}
                    selectedValue={dietaryConcern}
                    onValueChange={setDietaryConcern}
                  />

                  <View style={styles.dishContainer}>
                    {dishes.map((dish, index) => (
                      <View key={index} style={styles.dishCard}>
                        <Image
                          source={
                            dish.image.startsWith("data:image")
                              ? { uri: dish.image }
                              : require("../assets/images/assets/sussi.png")
                          }
                          style={styles.dishImage}
                        />
                        <Text style={styles.dishTitle}>{dish.name}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => router.push("/(tabs)")}
                  >
                    <Text style={styles.moreButtonText}>Click for more</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC107",
  },
  topImage: {
    position: "absolute",
    width: "100%",
    height: height * 0.36,
    top: 0,
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: height * 0.36,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  formBackground: {
    flex: 1,
    zIndex: 100,
    width: "100%",
    alignItems: "center",
    position: "relative",
    height: height,
    top: -height * 0.1,
    paddingTop: moderateScale(20),
  },
  formContainer: {
    width: "85%",
    alignItems: "center",
    paddingVertical: moderateScale(70),
    borderRadius: moderateScale(10),
  },
  homeButton: {
    position: "absolute",
    top: moderateScale(80),
    left: -10,
    backgroundColor: "#fff",
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(4),
    alignItems: "center",
    flexDirection: "row",
  },
  homeButtonText: {
    color: "#333",
    fontFamily: "PoppinsBold",
    fontSize: moderateScale(13),
  },
  logo: {
    width: moderateScale(120),
    height: moderateScale(120),
    resizeMode: "contain",
    marginBottom: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(18),
    color: "#333",
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: "#B33939",
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
    marginBottom: moderateScale(10),
  },
  highlight: {
    color: "#424242",
  },
  highlightAlt: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#D9534F",
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(20),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "PoppinsLight",
  },
  dishContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: moderateScale(20),
  },
  dishCard: {
    width: "49%",
    backgroundColor: "#FFF3E0",
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: moderateScale(12),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: moderateScale(40),
    height: moderateScale(30),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(10),
    resizeMode: "cover",
  },
  dishTitle: {
    fontSize: moderateScale(10),
    color: "#333",
    fontFamily: "PoppinsMedium",
    textAlign: "left",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  moreButton: {
    backgroundColor: "#888",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(20),
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  moreButtonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
});

export default DietaryForm;
