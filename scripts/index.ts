import { fallbackImage } from "@/constants";
import { Colors } from "@/constants/Colors";
import { Channel } from "stream-chat";
import {
  DEFAULT_STATUS_ICON_SIZE,
  DefaultStreamChatGenerics,
  Theme,
} from "stream-chat-expo";

export const getPercent = (percent: number, total: number) => {
  return (percent / 100) * total;
};

export function getTimeElapsed(createdAt: string) {
  const now = new Date();
  if (!createdAt) return "0min";

  const createdAtDate = new Date(createdAt);

  const timeDifference = now - createdAtDate; // time difference in milliseconds

  // Calculate the differences in various units
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return the time elapsed in a readable format
  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return `${seconds}s`;
  }
}

export const isProfileHealty = async (image: string) => {
  try {
    const response = await fetch(image);
    // Check if the response is OK (status code 200-299)
    if (response.ok) {
      return image;
    } else {
      return fallbackImage;
    }
  } catch (error) {
    return fallbackImage;
  }
};

export function toCamelCase(str) {
  return str
    .replace(/(?:^|[_-])(\w)/g, (_, char) => char.toUpperCase()) // Uppercase the first character and any character after `_` or `-`
    .replace(/[_-]/g, ""); // Remove `_` or `-`
}

export const channeltheme: Theme = {
  emptyStateIndicator: {
    messageContainer: {
      display:'none'
    },
  },
  groupAvatar: {
    container: {
      padding: 9,
    },
    image: {
      padding: 9,
    },
  },
  messageSimple: {
    container: {
      marginVertical: 5,
    },
    actions: {},
    content: {
      markdown: {
        text: {
          color: Colors.dark.text,
        },
      },
      senderMessageBackgroundColor: Colors.light.primary,
      receiverMessageBackgroundColor: Colors.light.primaryLight,
      textContainer: {
        onlyEmojiMarkdown: {
          text: {
            fontSize: 20,
          },
        },
      },
    },
  },
  messageList: {
    container: {
      backgroundColor: "transparent",
    },
  },
};
