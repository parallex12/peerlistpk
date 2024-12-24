import { ChatWrapper } from "@/components/ChatWrapper";
import { Colors } from "@/constants/Colors";
import { AppOverlayProvider } from "@/context/AppOverlayProvider";
import { useAuth } from "@/context/AuthProvider";
import { UserSearchProvider } from "@/context/UserSearchContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { Image, Platform } from "react-native";
import { IconButton } from "react-native-paper";

export default function HomeLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text"
  );

  const borderColor = useThemeColor(
    {
      light: Colors.light.border,
      dark: Colors.dark.border,
    },
    "border"
  );

  const activeTab = segments[segments.length - 1] || "Home";

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <ChatWrapper>
      <AppOverlayProvider>
        <UserSearchProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Chats",
                headerShown: activeTab == "(tabs)",
                headerLargeTitle: Platform.OS == "ios",
                headerTransparent: Platform.OS == "ios",
                headerShadowVisible: false,
                headerSearchBarOptions: {
                  placeholder: "search",
                  textColor: Colors.dark.text,
                  hintTextColor: Colors.light.icon,
                  tintColor: Colors.light.primary,
                  barTintColor: Colors.dark.icon,
                },
                headerTitleStyle: {
                  color: textColor,
                },
                // headerBackground: () => <BlurTabBarBackground />,
                headerBlurEffect: "light",
                headerStyle: {
                  backgroundColor: "transparent", // Make header transparent
                },
                headerLeft: () => (
                  <Image
                    source={require("@/assets/images/logo.png")}
                    resizeMode="contain"
                    style={{ width: 50, height: 50 }}
                  />
                ),
                headerRight: () => (
                  <IconButton
                    icon={"plus"}
                    iconColor={"#fff"}
                    size={15}
                    onPress={() => router.push("/turboscreens/NewChat")}
                    mode="contained"
                    containerColor={Colors?.light.primary}
                  />
                ),
              }}
            />
          </Stack>
        </UserSearchProvider>
      </AppOverlayProvider>
    </ChatWrapper>
  );
}
