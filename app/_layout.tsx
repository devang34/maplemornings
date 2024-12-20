import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PoppinsBlack: require("../assets/fonts/Poppins-Black.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StripeProvider
        publishableKey={"pk_test_51QHj9JCuy3kT1fhWHWjYm1IKQyeu3hzKois8fIH5xVezp1bbmvCKHnOH1ny2mtPiVCRRvyEs26EyBpElsbHi39fp0098OHJhxO"}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 50,
          }}
        >
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              animation: 'fade',
              animationDuration: 50,
            }} 
          />
          <Stack.Screen 
            name="+not-found"
            options={{
              animation: 'fade',
              animationDuration: 50,
            }}
          />
        </Stack>
      </StripeProvider>
      <Toast />
    </ThemeProvider>
  );
}