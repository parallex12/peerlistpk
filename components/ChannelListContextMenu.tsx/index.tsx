import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import { auth } from "@/services/firebase";
import { ChannelPreviewMessengerProps } from "stream-chat-expo";
import ContextMenu from "react-native-context-menu-view";
import { PropsWithChildren } from "react";
import { getPercent } from "@/scripts";

interface ChannelMenuProps {
  channelPreview: ChannelPreviewMessengerProps;
}

const ChannelListContextMenu: React.FC<PropsWithChildren<ChannelMenuProps>> = (
  props
) => {
  const { children, channelPreview } = props;
  const { channel, muted, unread } = channelPreview;
  const user = auth.currentUser;
  const { height, width } = useWindowDimensions();
  const styles = _styles({ width, height });
  const chatOptions = [
    { title: muted ? "Unmute" : "Mute" },
    { title: "Delete" },
  ];

  unread && chatOptions?.push({ title: "Mark as read" });

  const handleOptionPress = async (option: string) => {
    try {
      switch (option) {
        case "Mute":
          await channel.mute(); // Stream Chat mute method
          break;
        case "Unmute":
          await channel.unmute(); // Stream Chat mute method
          break;
        case "Mark as read":
          await channel.markRead(); // Stream Chat delete method
          break;
        case "Delete":
          user?.uid && (await channel.removeMembers([user?.uid]));
          await channel.truncate({ user_id: user?.uid });
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred while performing the action.");
    }
  };

  return (
    <ContextMenu
      actions={chatOptions}
      onPress={(e) => handleOptionPress(e.nativeEvent.name)}
      previewBackgroundColor="#fff"
    >
      {children}
    </ContextMenu>
  );
};

const _styles = ({ width, height }: any) =>
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: "transparent",
    },
  });
export default ChannelListContextMenu;
