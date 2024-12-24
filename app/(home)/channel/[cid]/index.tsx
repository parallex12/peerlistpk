import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Channel,
  EmptyStateIndicator,
  MessageAvatar,
  MessageInput,
  MessageList,
  ThemeProvider,
  useAttachmentPickerContext,
  useChatContext,
  Theme,
  useTypingString,
} from "stream-chat-expo";
import { Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAvoidingView } from "react-native";
import { channeltheme, getPercent } from "@/scripts";
import { View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import UserChatProfile from "@/components/UserChatProfile";
import { ThemedText } from "@/components/ThemedText";

const ChannelScreen = () => {
  const { client, channel } = useChatContext();
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const styles = _styles({ height });
  const { setTopInset } = useAttachmentPickerContext();
  const headerHeight = useHeaderHeight();
  const [isBlocked, setIsBlocked] = useState(false);
  const member =
    channel &&
    Object.values(channel.state.members).find(
      (channelMember) => channelMember?.user?.id !== client?.user?.id
    );

  const isOneOnOneConversation =
    channel &&
    Object.values(channel.state.members).length === 2 &&
    channel.id?.indexOf("!members-") === 0;
  const IMAGE_URI = require("@/assets/images/chatbg.png");
  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text"
  );

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight, setTopInset]);

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

  if (!channel) {
    return (
      <SafeAreaView>
        <Text>Loading chat ...</Text>
      </SafeAreaView>
    );
  }

  const onProfile = () => {
    if (isOneOnOneConversation) {
      router.push("/turboscreens/OneOnOneChannelDetailScreen");
    } else {
      router.push("/turboscreens/GroupChannelDetailsScreen");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: (props) =>
            member?.user && (
              <UserChatProfile onPress={onProfile} user={member?.user} />
            ),
          headerShown: true,
          headerTransparent: Platform.OS == "ios",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
          headerBlurEffect: "light",
          headerRight: () => (
            <IconButton
              icon="phone"
              iconColor={Colors.light.background}
              size={18}
              mode="contained"
              style={{ backgroundColor: Colors.light.primary, bottom: 3 }}
              onPress={() => console.log("Pressed")}
            />
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <ThemeProvider style={channeltheme}>
          {channel ? (
            <Channel
              disableKeyboardCompatibleView
              audioRecordingEnabled
              giphyEnabled={false}
              channel={channel}
              hasCommands={false}
              asyncMessagesMultiSendEnabled={true}
              EmptyStateIndicator={() => (
                <EmptyStateIndicator listType="message" />
              )}
              messageActions={({
                copyMessage,
                deleteMessage,
                editMessage,
                flagMessage,
                pinMessage,
                quotedReply,
              }) => [
                quotedReply,
                editMessage,
                copyMessage,
                flagMessage,
                pinMessage,
                deleteMessage,
              ]}
            >
              <ImageBackground style={{ flex: 1 }} source={require("@/assets/images/chatbg.png")}>
                <MessageList
                  additionalFlatListProps={{
                    ListFooterComponent: (
                      <View
                        style={{
                          backgroundColor: "transparent",
                          height: getPercent(12, height),
                        }}
                      ></View>
                    ),
                  }}
                />
                {!isBlocked ? (
                  <MessageInput />
                ) : (
                  <ThemedView style={styles.blockView}>
                    <ThemedText type="link">
                      You have blocked this user.
                    </ThemedText>
                  </ThemedView>
                )}
              </ImageBackground>
            </Channel>
          ) : null}
        </ThemeProvider>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const _styles = ({ height }: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      paddingBottom: 15,
    },
    blockView: {
      backgroundColor: "#fff",
      width: "100%",
      height: getPercent(5, height),
      alignItems: "center",
      justifyContent: "center",
    },
  });
export default ChannelScreen;
