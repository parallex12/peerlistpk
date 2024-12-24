import React from "react";
import { Redirect, Slot, Stack } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, Image, SafeAreaView } from "react-native";
import { DarkTheme } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useChatContext } from "stream-chat-expo";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // If chat client is not initialized or still loading
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          resizeMode="contain"
          style={{ width: 200 }}
        />
      </SafeAreaView>
    );
  }
  return user ? (
    <Redirect href="/(home)/(tabs)" />
  ) : (
    <Stack>
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          title: "Let's get you started!",
          headerShown: true,
          headerLargeTitle: true,
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: Colors.light.text,
          },
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <Stack.Screen
        name="forgotpassword"
        options={{
          title: "What's your email?",
          headerShown: true,
          headerLargeTitle: true,
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: Colors.light.text,
          },
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
    </Stack>
  );
}
