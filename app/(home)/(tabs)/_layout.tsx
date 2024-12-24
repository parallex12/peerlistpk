import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";
import { ThemedText } from "@/components/ThemedText";
import { useChatContext } from "stream-chat-expo";

export default function TabLayout() {
  const router = useRouter();
  const { client } = useChatContext();
  const [unread, setUnreadCount] = useState<string | number | undefined>();

  useEffect(() => {
    (async () => {
      const res = await client.getUnreadCount();
      setUnreadCount(res?.total_unread_count);
    })();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.dark.icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <BlurTabBarBackground />,
        tabBarStyle: {
          borderColor: "#f8f8f8",
          ...Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {
              backgroundColor: "#fff",
              borderWidth: 0,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarBadge: unread,
          tabBarBadgeStyle: {
            backgroundColor: Colors.light.primary,
          },
          title: "Chats",
          headerShown: false,
          headerStyle: {
            height: 0,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubble-sharp" : "chatbubble-outline"}
              size={22}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 2,
            fontSize: 12,
          },
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: () => null,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
          },
          headerBackground: () => <BlurTabBarBackground />,
          headerLeft: () => <ThemedText type="title">Settings</ThemedText>,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              size={22}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 2,
            fontSize: 12,
          },
        }}
      />
    </Tabs>
  );
}
