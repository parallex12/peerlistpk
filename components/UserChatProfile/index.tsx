import React, { ReactNode, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Avatar,
  DefaultStreamChatGenerics,
  useChatContext,
} from "stream-chat-expo";
import { UserResponse } from "stream-chat";
import { ThemedText } from "@/components/ThemedText";
import { isProfileHealty } from "@/scripts";
import { fallbackImage } from "@/constants";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

interface UserChatProfileProps {
  onPress: (val: UserResponse<DefaultStreamChatGenerics>) => void;
  children?: ReactNode;
  user: UserResponse<DefaultStreamChatGenerics>;
}

const UserChatProfile: React.FC<UserChatProfileProps> = ({
  onPress,
  children,
  user,
}) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const [profile, setProfile] = useState(fallbackImage);
  const { client, channel } = useChatContext();
  const chatName = channel?.data?.name || user?.name;

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

  const onBack = () => router.back();

  return (
    <TouchableOpacity style={styles.userItem} onPress={onPress}>
      <TouchableOpacity onPress={onBack}>
        <Entypo name="chevron-thin-left" size={20} color="black" />
      </TouchableOpacity>
      <Avatar
        online={user?.online}
        size={30}
        image={profile}
        name={user?.name}
      />
      <ThemedText type="default">{chatName}</ThemedText>
    </TouchableOpacity>
  );
};
const _styles = (width: number, height: number) =>
  StyleSheet.create({
    userItem: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    userName: {
      fontSize: 18,
    },
    userInfoWrapper: {
      flex: 1,
    },
  });
export default UserChatProfile;
