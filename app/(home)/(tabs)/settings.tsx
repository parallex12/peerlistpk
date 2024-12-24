import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Avatar, useChatContext } from "stream-chat-expo";
import { getPercent, isProfileHealty } from "@/scripts";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { fallbackImage } from "@/constants";
import { ThemedText } from "@/components/ThemedText";
import { auth } from "@/services/firebase";
import { View } from "react-native";
import { IconButton, Switch } from "react-native-paper";
import { SignOut } from "@/scripts/auth";

const SettingsCard = ({
  icon,
  switchEnabled,
  isSwitch,
  title,
  onPress,
  onSwitch,
  onArrow,
}: any) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  return (
    <Pressable onPress={onPress} style={styles.settingsCard}>
      <View style={styles.settingsCol1}>
        <IconButton iconColor={Colors.light.icon} icon={icon} size={22} />
        <ThemedText type="default">{title}</ThemedText>
      </View>
      {isSwitch ? (
        <Switch onValueChange={onSwitch} value={switchEnabled} />
      ) : (
        <IconButton onPress={onArrow} icon="chevron-right" />
      )}
    </Pressable>
  );
};

export default function Settings() {
  const { client } = useChatContext();
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const [profile, setProfile] = useState<string>(fallbackImage);
  const [notificationEnabled, setnotificationEnabled] =
    useState<boolean>(false);
  const user = client?.user;
  const checkProfileHealth = async (image: string) => {
    const result = await isProfileHealty(image);
    setProfile(result);
  };

  useEffect(() => {
    let isDis = Object.values(client?.user?.push_notifications || {});
    setnotificationEnabled(isDis?.length == 0);
  }, []);

  const onNotifcationSwitch = async (state: boolean) => {
    if (!client.user?.id) return;
    await client.upsertUser({
      push_notifications: {
        disabled: !state,
      },
      id: client.user?.id,
    });
    setnotificationEnabled(state);
  };

  const onLogout = async () => {
    await client.disconnectUser();
    await SignOut();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.settingsWrapper}>
        <ThemedView style={styles.profileCard}>
          <Avatar size={50} image={profile} />
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">
              {user?.name || user?.username || "Mantos User"}
            </ThemedText>
            <ThemedText type="default">
              {auth.currentUser?.email || "guest@mantos.com"}
            </ThemedText>
          </View>
        </ThemedView>
        <View style={styles.spacer} />
        <SettingsCard title="Avatar" icon="face-man-profile" />
      </View>
      <View style={styles.settingsWrapper}>
        <SettingsCard title="Privacy" icon="lock-outline" />
        <View style={styles.spacer} />
        <SettingsCard
          title="Notifications"
          icon="bell-outline"
          isSwitch
          switchEnabled={notificationEnabled}
          onSwitch={onNotifcationSwitch}
        />
        <SettingsCard title="Logout" icon="logout" onPress={onLogout} />
      </View>
    </ThemedView>
  );
}
const _styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: getPercent(12, height),
      paddingHorizontal: getPercent(3, width),
      backgroundColor: Colors.light.background,
      gap: 10,
    },
    avatar: {
      width: getPercent(10, width),
      height: getPercent(10, height),
      borderWidth: 1,
      borderRadius: 100,
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      backgroundColor: "transparent",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      gap: 10,
    },
    settingsWrapper: {
      backgroundColor: "#f5f5f5",
      borderRadius: 10,
    },
    spacer: {
      width: "100%",
      backgroundColor: Colors.light.border,
      paddingVertical: 1,
    },
    settingsCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      backgroundColor: "transparent",
      paddingVertical: 2,
    },
    settingsCol1: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
  });
