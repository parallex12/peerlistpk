import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useChatContext, useStateStore, useTheme } from "stream-chat-expo";

import { ThreadManagerState } from "stream-chat";

const styles = StyleSheet.create({
  unreadContainer: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
});

const selector = (nextValue: ThreadManagerState) =>
  ({ unreadCount: nextValue.unreadThreadCount } as const);

export const ThreadsUnreadCountBadge: React.FC = () => {
  const { client: chatClient } = useChatContext();
  const { unreadCount } = useStateStore(chatClient?.threads?.state, selector);

  return <UnreadCountBadge unreadCount={unreadCount} />;
};

export const ChannelsUnreadCountBadge: React.FC = () => {
  const { client } = useChatContext();

  return <UnreadCountBadge unreadCount={1} />;
};

type UnreadCountBadgeProps = {
  unreadCount: number | undefined;
};

const UnreadCountBadge: React.FC<UnreadCountBadgeProps> = (props) => {
  const { unreadCount } = props;
  const {
    theme: {
      colors: { accent_red },
    },
  } = useTheme();

  return (
    <View style={[styles.unreadContainer, { backgroundColor: accent_red }]}>
      {!!unreadCount && (
        <Text style={styles.unreadText}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </Text>
      )}
    </View>
  );
};
