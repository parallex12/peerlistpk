import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "stream-chat-expo";
import { Contacts } from "@/icons/Contacts";
import { Delete } from "@/icons/Delete";
import { File } from "@/icons/File";
import { GoBack } from "@/icons/GoBack";
import { GoForward } from "@/icons/GoForward";
import { Mute } from "@/icons/Mute";
import { Notification } from "@/icons/Notification";
import { Picture } from "@/icons/Picture";
import { Pin } from "@/icons/Pin";

import type { RouteProp } from "@react-navigation/native";
import { useChatContext } from "stream-chat-expo";
import { fallbackImage } from "@/constants";
import { isProfileHealty } from "@/scripts";
import { router, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { BlockUser } from "@/icons/BlockUser";
import { useAppOverlayContext } from "@/context/AppOverlayContext";
import { useBottomSheetOverlayContext } from "@/context/BottomSheetOverlayContext";

const styles = StyleSheet.create({
  actionContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  actionLabelContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    borderRadius: 36,
    height: 72,
    width: 72,
  },
  backButton: {
    left: 0,
    paddingLeft: 16,
    position: "absolute",
    top: 0,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 16,
  },
  itemText: {
    fontSize: 14,
    paddingLeft: 16,
  },
  onlineIndicator: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  onlineStatus: {
    fontSize: 12,
    paddingLeft: 8,
  },
  onlineStatusContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 16,
    paddingTop: 8,
  },
  spacer: {
    height: 8,
  },
  userInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  userName: {
    fontSize: 14,
  },
  userNameContainer: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});

const Spacer = () => {
  const {
    theme: {
      colors: { grey_gainsboro },
    },
  } = useTheme();
  return (
    <View
      style={[
        styles.spacer,
        {
          backgroundColor: grey_gainsboro,
        },
      ]}
    />
  );
};

const OneOnOneChannelDetailScreen: React.FC = () => {
  const {
    theme: {
      colors: {
        accent_green,
        accent_red,
        black,
        border,
        grey,
        white,
        white_smoke,
      },
    },
  } = useTheme();
  const { client, channel } = useChatContext();
  const { setOverlay } = useAppOverlayContext();
  const { setData } = useBottomSheetOverlayContext();
  const [isBlocked, setIsBlocked] = useState(false);

  if (!channel) return;

  const member = Object.values(channel.state.members).find(
    (channelMember) => channelMember?.user?.id !== client?.user?.id
  );
  const user = member?.user;

  const [muted, setMuted] = useState(
    client?.mutedUsers &&
      client?.mutedUsers?.findIndex(
        (mutedUser) => mutedUser.target.id === user?.id
      ) > -1
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    client?.mutedChannels &&
      client.mutedChannels.findIndex(
        (mutedChannel) => mutedChannel.channel?.id === channel.id
      ) > -1
  );

  if (!user) {
    return null;
  }
  useEffect(() => {
    (async () => {
      const resp = await client.getBlockedUsers();
      if (resp?.blocks) {
        resp?.blocks?.map((item) => {
          if (item.blocked_user_id == member?.user_id) {
            setIsBlocked(true);
          } else {
            setIsBlocked(false);
          }
        });
      }
    })();
  }, []);

  const BlockConversation = async () => {
    await client.blockUser(user.id);
    setOverlay("none");
    router.replace("/(home)/(tabs)");
  };

  const UnBlockConversation = async () => {
    await client.unBlockUser(user.id);
    setOverlay("none");
    router.replace("/(home)/(tabs)");
  };

  /**
   * Opens confirmation sheet for deleting the conversation
   */
  const openBlockConversationConfirmationSheet = () => {
    if (!client?.user?.id) {
      return;
    }
    if (isBlocked) {
      setData({
        confirmText: "Unblock",
        onConfirm: UnBlockConversation,
        subtext: "Are you sure you want to unblock this person?",
        title: "Unblock User",
      });
    } else {
      setData({
        confirmText: "Block",
        onConfirm: BlockConversation,
        subtext: "Are you sure you want to block this person?",
        title: "Block User",
      });
    }
    setOverlay("confirmation");
  };

  return (
    <SafeAreaView style={[{ backgroundColor: white }, styles.container]}>
      <Stack.Screen
        options={{
          title: "Profile",
          headerShown: true,
          headerTransparent: Platform.OS == "ios",
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: Colors.light.text,
          },
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: fallbackImage,
            }}
            style={styles.avatar}
          />
          <Text
            style={[
              styles.displayName,
              {
                color: black,
              },
            ]}
          >
            {user.name}
          </Text>
          <View style={styles.onlineStatusContainer}>
            {user.online && (
              <View
                style={[
                  { backgroundColor: accent_green },
                  styles.onlineIndicator,
                ]}
              />
            )}
            <Text
              style={[
                styles.onlineStatus,
                {
                  color: black,
                },
              ]}
            >
              {user?.online ? "Online" : null}
            </Text>
          </View>
        </View>
        <Spacer />
        <TouchableOpacity
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <Notification fill={grey} height={24} width={24} />
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Notifications
            </Text>
          </View>
          <View>
            <Switch
              onValueChange={async () => {
                if (notificationsEnabled) {
                  await channel.unmute();
                } else {
                  await channel.mute();
                }
                setNotificationsEnabled((previousState: any) => !previousState);
              }}
              trackColor={{
                false: white_smoke,
                true: accent_green,
              }}
              value={notificationsEnabled}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <Mute height={24} width={24} />
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Mute user
            </Text>
          </View>
          <View>
            <Switch
              onValueChange={async () => {
                if (muted) {
                  const r = await client?.unmuteUser(user.id);
                  console.warn(r);
                } else {
                  const r = await client?.muteUser(user.id);
                  console.warn(r);
                }
                setMuted((previousState: any) => !previousState);
              }}
              trackColor={{
                false: white_smoke,
                true: accent_green,
              }}
              value={muted}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/turboscreens/ChannelImagesScreen")}
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <Picture fill={grey} />
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Photos and Videos
            </Text>
          </View>
          <View>
            <GoForward fill={grey} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/turboscreens/ChannelFilesScreen")}
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <File pathFill={grey} />
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Files
            </Text>
          </View>
          <View>
            <GoForward fill={grey} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/turboscreens/SharedGroupsScreen",
              params: { ...user },
            });
          }}
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <Contacts fill={grey} />
            <Text
              style={[
                styles.itemText,
                {
                  color: black,
                },
              ]}
            >
              Shared Groups
            </Text>
          </View>
          <View>
            <GoForward fill={grey} />
          </View>
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity
          onPress={openBlockConversationConfirmationSheet}
          style={[
            styles.actionContainer,
            {
              borderBottomColor: border,
            },
          ]}
        >
          <View style={styles.actionLabelContainer}>
            <BlockUser fill={accent_red} height={24} width={24} />
            <Text
              style={[
                styles.itemText,
                {
                  color: accent_red,
                },
              ]}
            >
              {isBlocked ? "Unblock contact" : "Block contact"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default OneOnOneChannelDetailScreen;
