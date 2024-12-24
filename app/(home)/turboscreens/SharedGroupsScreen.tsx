import React from "react";
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Avatar,
  ChannelList,
  ChannelListMessenger,
  ChannelListMessengerProps,
  ChannelPreviewMessengerProps,
  getChannelPreviewDisplayAvatar,
  GroupAvatar,
  useChannelPreviewDisplayName,
  useChannelsContext,
  useChatContext,
  useTheme,
} from "stream-chat-expo";

import { Contacts } from "@/icons/Contacts";

import type {
  StackNavigatorParamList,
  StreamChatGenerics,
} from "@/types/types";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getPercent } from "@/scripts";
const height = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyListContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emptyListSubtitle: {
    marginTop: 8,
    textAlign: "center",
  },
  emptyListTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  groupContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  nameText: {
    fontWeight: "700",
    marginLeft: 8,
  },
  previewContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
});

type CustomPreviewProps = ChannelPreviewMessengerProps<StreamChatGenerics>;

const CustomPreview: React.FC<CustomPreviewProps> = ({ channel }) => {
  const { client: chatClient,setActiveChannel } = useChatContext();
  const name = useChannelPreviewDisplayName(channel, 30);
  const router = useRouter();
  const navigation =
    useNavigation<
      NavigationProp<StackNavigatorParamList, "SharedGroupsScreen">
    >();
  const {
    theme: {
      colors: { black, grey, grey_whisper, white_snow },
    },
  } = useTheme();

  if (!chatClient) {
    return null;
  }

  if (Object.keys(channel.state.members).length === 2) {
    return null;
  }

  const displayAvatar = getChannelPreviewDisplayAvatar(channel, chatClient);

  const switchToChannel = () => {
    setActiveChannel(channel);
    router.push(`/channel/${channel.cid}`);
  };

  return (
    <TouchableOpacity
      onPress={switchToChannel}
      style={[
        styles.previewContainer,
        {
          backgroundColor: white_snow,
          borderBottomColor: grey_whisper,
        },
      ]}
    >
      <View style={styles.groupContainer}>
        {displayAvatar.images ? (
          <GroupAvatar
            images={displayAvatar.images}
            names={displayAvatar.names}
            size={40}
          />
        ) : (
          <Avatar
            image={displayAvatar.image}
            name={displayAvatar.name}
            size={40}
          />
        )}
        <Text style={[styles.nameText, { color: black }]}>{name}</Text>
      </View>
      <Text
        style={{
          color: grey,
        }}
      >
        {Object.keys(channel.state.members).length} Members
      </Text>
    </TouchableOpacity>
  );
};

const EmptyListComponent = () => {
  const {
    theme: {
      colors: { black, grey, grey_gainsboro },
    },
  } = useTheme();

  return (
    <View style={styles.emptyListContainer}>
      <Contacts fill={grey_gainsboro} scale={6} />
      <Text style={[styles.emptyListTitle, { color: black }]}>
        No shared groups
      </Text>
      <Text style={[styles.emptyListSubtitle, { color: grey }]}>
        Groups shared with user will appear here
      </Text>
    </View>
  );
};

type ListComponentProps = ChannelListMessengerProps<StreamChatGenerics>;

// If the length of channels is 1, which means we only got 1:1-distinct channel,
// And we don't want to show 1:1-distinct channel in this list.
const ListComponent: React.FC<ListComponentProps> = (props) => {
  const { channels, loadingChannels, refreshing } = useChannelsContext();
  if (!channels) return;
  if (channels.length <= 1 && !loadingChannels && !refreshing) {
    return <EmptyListComponent />;
  }

  return <ChannelListMessenger {...props} />;
};

type SharedGroupsScreenRouteProp = RouteProp<
  StackNavigatorParamList,
  "SharedGroupsScreen"
>;

const SharedGroupsScreen: React.FC = () => {
  const { client: chatClient } = useChatContext();
  const router = useRoute();
  const user = router?.params;
  if (!chatClient?.user || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Groups",
          headerShown: true,
          headerTransparent: Platform.OS == "ios",
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: Colors.light.text,
          },
        }}
      />
      <ChannelList
        filters={{
          $and: [
            { members: { $in: [chatClient?.user?.id] } },
            { members: { $in: [user.id] } },
          ],
        }}
        List={ListComponent}
        options={{
          watch: false,
        }}
        Preview={CustomPreview}
        sort={{
          last_updated: -1,
        }}
        additionalFlatListProps={{
          contentContainerStyle: {
            paddingTop: getPercent(10, height),
          },
          bounces: true,
        }}
      />
    </View>
  );
};
export default SharedGroupsScreen;
