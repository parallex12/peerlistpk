import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { auth } from "@/services/firebase";
import {
  Avatar,
  ChannelAvatar,
  ChannelList,
  Skeleton,
  useChatContext,
} from "stream-chat-expo";
import { useNavigation, useRouter } from "expo-router";
import { fallbackImage } from "@/constants";
import { getPercent } from "@/scripts";
import { NetworkDownIndicator } from "@/components/NetworkDownIndicator";
import CustomChatListItem from "@/components/CustomChatListItem";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const styles = _styles({ width, height });
  const { client, channel, setActiveChannel } = useChatContext();
  const navigation = useNavigation();
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.background,
      dark: Colors.dark.background,
    },
    "background"
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, []);

  return (
    <View style={styles.main}>
      {auth?.currentUser?.uid && (
        <ChannelList
          HeaderNetworkDownIndicator={() => <NetworkDownIndicator />}
          additionalFlatListProps={{
            contentContainerStyle: {
              backgroundColor: backgroundColor,
              paddingTop: getPercent(Platform.OS == "ios" ? 21 : 0, height),
              paddingBottom: getPercent(9.2, height),
              paddingHorizontal: getPercent(0, width),
            },
            bounces: true,
            style: {
              backgroundColor: backgroundColor,
            },
          }}
          Skeleton={() => <Skeleton />}
          numberOfSkeletons={10}
          Preview={CustomChatListItem}
          PreviewAvatar={({ channel }) => {
            return (
              <>
                {channel.data?.image != undefined ? (
                  <ChannelAvatar channel={channel} />
                ) : (
                  <Avatar size={40} image={fallbackImage} />
                )}
              </>
            );
          }}
          options={{
            limit: 20,
            message_limit: 20,
            user_id: auth?.currentUser?.uid,
            state: true,
            watch: true,
          }}
          sort={{ last_updated: -1 }}
          filters={{
            members: { $in: [auth?.currentUser?.uid] },
            type: "messaging",
          }}
          maxUnreadCount={99}
          onSelect={(channel) => {
            setActiveChannel(channel);
            router.push(`/channel/${channel.cid}`);
          }}
        />
      )}
    </View>
  );
}

const _styles = ({ width, height }: any) =>
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: "transparent",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: "absolute",
    },
  });
