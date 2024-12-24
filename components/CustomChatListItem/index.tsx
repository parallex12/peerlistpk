import { StyleSheet } from "react-native";
import {
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
} from "stream-chat-expo";
import { ThemedView } from "@/components/ThemedView";
import ChannelListContextMenu from "@/components/ChannelListContextMenu.tsx";
import { ThemedText } from "@/components/ThemedText";

const CustomChatListItem: React.FC<ChannelPreviewMessengerProps> = (props) => {
  const { muted } = props;
  return (
    <ChannelListContextMenu channelPreview={props}>
      <ThemedView style={{backgroundColor:'transparent'}}>
        <ChannelPreviewMessenger
          PreviewTitle={({ displayName }) => (
            <ThemedText type="default">{displayName}</ThemedText>
          )}
          muted={muted}
          {...props}
        />
      </ThemedView>
    </ChannelListContextMenu>
  );
};

export default CustomChatListItem;
