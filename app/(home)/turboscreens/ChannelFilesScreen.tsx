import React, { useEffect, useState } from "react";
import {
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dayjs from "dayjs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DefaultStreamChatGenerics,
  FileIcon,
  getFileSizeDisplayText,
  ThemeProvider,
  useChatContext,
  useTheme,
} from "stream-chat-expo";

import { usePaginatedAttachments } from "@/hooks/usePaginatedAttachments";
import { File } from "@/icons/File";

import type { Attachment } from "stream-chat";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import * as WebBrowser from "expo-web-browser";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  details: {
    flex: 1,
    paddingLeft: 16,
  },
  emptyContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  flex: {
    flex: 1,
  },
  noFiles: {
    fontSize: 16,
    paddingBottom: 8,
  },
  noFilesDetails: {
    fontSize: 14,
    textAlign: "center",
  },
  sectionContainer: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionContentContainer: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
  },
  size: {
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 2,
  },
});

const ChannelFilesScreen: React.FC = () => {
  const { client, channel } = useChatContext();
  if (!channel) return;
  const { loading, loadMore, messages } = usePaginatedAttachments(
    channel,
    "file"
  );
  const insets = useSafeAreaInsets();
  const {
    theme: {
      colors: { black, border, grey, white_snow },
    },
  } = useTheme();

  const [sections, setSections] = useState<
    Array<{
      data: Attachment<DefaultStreamChatGenerics>[];
      title: string;
    }>
  >([]);

  useEffect(() => {
    const newSections: Record<
      string,
      {
        data: Attachment<DefaultStreamChatGenerics>[];
        title: string;
      }
    > = {};

    messages.forEach((message) => {
      const month = Dayjs(message.created_at).format("MMM YYYY");

      if (!newSections[month]) {
        newSections[month] = {
          data: [],
          title: month,
        };
      }

      message.attachments?.forEach(
        (a: Attachment<DefaultStreamChatGenerics>) => {
          if (a.type !== "file") {
            return;
          }

          newSections[month].data.push(a);
        }
      );
    });

    setSections(Object.values(newSections));
  }, [messages]);

  const onOpenFile = async (url:string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: white_snow,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Stack.Screen
        options={{
          title: "Files",
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            color: Colors.light.text,
          },
        }}
      />
      <ThemeProvider>
        {(sections.length > 0 || !loading) && (
          <SectionList<Attachment<DefaultStreamChatGenerics>>
            contentContainerStyle={styles.sectionContentContainer}
            ListEmptyComponent={EmptyListComponent}
            onEndReached={loadMore}
            renderItem={({ index, item: attachment, section }) => (
              <TouchableOpacity
                key={`${attachment.asset_url}${attachment.image_url}${attachment.og_scrape_url}${attachment.thumb_url}${attachment.type}`}
                onPress={() => onOpenFile(attachment.asset_url || "")}
                style={{
                  borderBottomColor: border,
                  borderBottomWidth: index === section.data.length - 1 ? 0 : 1,
                }}
              >
                <View
                  style={[styles.container, { backgroundColor: white_snow }]}
                >
                  <FileIcon mimeType={attachment.mime_type} />
                  <View style={styles.details}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.title,
                        {
                          color: black,
                        },
                      ]}
                    >
                      {attachment.title}
                    </Text>
                    <Text
                      style={[
                        styles.size,
                        {
                          color: grey,
                        },
                      ]}
                    >
                      {getFileSizeDisplayText(attachment.file_size)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={[
                  styles.sectionContainer,
                  {
                    backgroundColor: white_snow,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: black }]}>
                  {title}
                </Text>
              </View>
            )}
            sections={sections}
            stickySectionHeadersEnabled
          />
        )}
      </ThemeProvider>
    </View>
  );
};

const EmptyListComponent = () => {
  const {
    theme: {
      colors: { black, grey, grey_gainsboro },
    },
  } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <File fill={grey_gainsboro} scale={6} />
      <Text style={[styles.noFiles, { color: black }]}>No files</Text>
      <Text style={[styles.noFilesDetails, { color: grey }]}>
        Files sent on this chat will appear here.
      </Text>
    </View>
  );
};
export default ChannelFilesScreen;
