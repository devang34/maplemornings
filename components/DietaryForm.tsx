import React, { useEffect, useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  Image,
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Disease, getAllDiseases, getDishByDisease } from "@/api/diseases";
import useStore from "@/hooks/useStore";
import { moderateScale } from "@/utils/spacing";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const screenHeight = Dimensions.get("window").height;

const DietaryForm = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [dietaryConcern, setDietaryConcern] = useState<string>("");
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const setDisease = useStore((state) => state.setDisease);
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
  const [submitted, setSubmitted] = useState(false);
  const [diseaseOptions, setDiseaseOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const token = useStore((state) => state.token);

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
        setDishes(res);
        setSubmitted(true);
        setIsVerified(true);
        setDisease(dietaryConcern);

        const selected = diseases.find(
          (disease) => disease.id.toString() === dietaryConcern
        );
        console.log(selected, "sel");
        setSelectedDisease(selected || null);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllDiseases(token || "")
      .then((res) => {
        const formattedOptions = res.map((disease) => ({
          label: disease.name,
          value: disease.id.toString(),
        }));
        setDiseases(res);
        console.log(res);
        setDiseaseOptions(formattedOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(dateOfBirth);
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate.toLocaleDateString());
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const renderPickerItem = ({
    item,
  }: {
    item: { label: string; value: string };
  }) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        setDietaryConcern(item.value);
        setModalVisible(false);
      }}
    >
      <Text style={styles.pickerItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Image
                source={require("../assets/images/mapple.png")}
                style={styles.headerImage}
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                backgroundColor: "#FFC72C",
                width: "100%",
                height: 10,
              }}
            ></View>

            {/* Form Content */}
            <View style={{ padding: 20 }}>
              <Text style={styles.title}>
                Concerned for your dietary restrictions?
              </Text>

              <Text style={styles.subtitle}>
                Maple Medical got you covered!
              </Text>

              {/* Date of Birth and Age Input */}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View style={{ width: "30%" }}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: "#FFC72C33",
                        borderColor: "#FFC72C",
                        fontFamily: "PoppinsSemiBold",
                        fontSize: moderateScale(16),
                        color: "#FFC72C",
                        alignItems: "center",
                      },
                    ]}
                    placeholder="XX"
                    value={age}
                    placeholderTextColor={"#FFC72C"}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    // editable={false}
                  />
                </View>
              </View>

              {/* Dietary Concern Picker */}
              <Text style={styles.label}>Choose the Dietary concern</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ fontSize: moderateScale(16) }}>
                  {diseaseOptions.find(
                    (option) => option.value === dietaryConcern
                  )?.label || "Select a dietary concern"}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={diseaseOptions}
                      renderItem={renderPickerItem}
                      keyExtractor={(item) => item.value}
                    />
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {submitted && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>
                    Some information on staying healthy!
                  </Text>
                  <Text style={styles.infoText}>
                    {selectedDisease?.prevention}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.saveButton}
              >
                {submitted ? (
                  <Text style={styles.saveButtonText}>Edit</Text>
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
              {submitted && (
                <View style={styles.dishContainer}>
                  {dishes.map((dish, index) => (
                      <View key={index} style={styles.dishCard}>
                        <Image
                          source={{ uri: dish.image }}
                          style={styles.dishImage}
                        />
                        <Text style={styles.dishTitle}>{dish.name}</Text>
                      </View>
                  ))}
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)")}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textDecorationLine: "underline" }}>
                      View More
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: moderateScale(32),
  },
  headerSection: {
    backgroundColor: "#0F6D41",
    width: "100%",
    height: screenHeight * 0.35,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: screenHeight * 0.35,
    position: "absolute",
  },
  title: {
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#0F6D41",
    fontFamily: "PoppinsMedium",
    marginBottom: 16,
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 0.8,
    borderColor: "#D9D9D9",
    borderRadius: 3,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    marginBottom: moderateScale(16),
    fontSize: moderateScale(16),
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
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: "#0F6D41",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#0F6D41",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    fontStyle: "italic",
  },
  saveButton: {
    backgroundColor: "#0F6D41",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DietaryForm;
