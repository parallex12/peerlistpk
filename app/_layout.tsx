//app/_layout.tsx
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { DefaultTheme, PaperProvider } from "react-native-paper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
import "react-native-gesture-handler";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/AuthProvider";

axios.defaults.baseURL = "https://stream-chat-backend.vercel.app";
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null; // Wait for fonts to load

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <PaperProvider>
          <AuthProvider>
              <Slot />
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
