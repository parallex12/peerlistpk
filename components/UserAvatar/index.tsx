import React, { ReactNode, useEffect, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Avatar, DefaultStreamChatGenerics } from "stream-chat-expo";
import { ThemedView } from "@/components/ThemedView";
import { UserResponse } from "stream-chat";
import { ThemedText } from "@/components/ThemedText";
import { getPercent, getTimeElapsed, isProfileHealty } from "@/scripts";
import { fallbackImage } from "@/constants";
import { IconButton, MD3Colors } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

interface UserAvatarProps {
  onPress: (val: UserResponse<DefaultStreamChatGenerics>) => void;
  children?: ReactNode;
  user: UserResponse<DefaultStreamChatGenerics>;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ onPress, children, user }) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const [profile, setProfile] = useState(fallbackImage);
  const borderColor = useThemeColor(
    {
      light: Colors.light.border,
      dark: Colors.dark.border,
    },
    "border"
  );
  const checkProfileHealth = async (image: string) => {
    const result = await isProfileHealty(image);
    setProfile(result);
  };

  useEffect(() => {
    (async () => {
      if (user?.image) {
        await checkProfileHealth(user?.image);
      }
    })();
  }, []);

  return (
    <ThemedView style={[styles.userItem,{borderColor}]}>
      <Avatar
        online={user?.online}
        size={40}
        image={profile}
        name={user?.name}
      />
      <View style={styles.userInfoWrapper}>
        <ThemedText type="default">{user.name}</ThemedText>
        <ThemedText type="default" style={{ fontSize: 12 }}>
          Last online {getTimeElapsed(user.last_active || "")}
        </ThemedText>
      </View>
      <IconButton
        icon="chat"
        iconColor={Colors.dark.text}
        size={20}
        mode="contained"
        onPress={() => onPress(user)}
        style={{ backgroundColor:Colors.light.primary }}
      />
    </ThemedView>
  );
};
const _styles = (width: number, height: number) =>
  StyleSheet.create({
    userItem: {
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingHorizontal: getPercent(3, width),
      paddingVertical: getPercent(1, height),
      gap: 10,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    userName: {
      fontSize: 18,
    },
    userInfoWrapper: {
      flex: 1,
    },
  });
export default UserAvatar;
