import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-expo";
import { Stack, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { auth } from "@/services/firebase";
import { UserResponse } from "stream-chat";
import { getPercent } from "@/scripts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { UserSearchResults } from "@/streamComponents/UserSearch/UserSearchResults";
import { useUserSearchContext } from "@/context/UserSearchContext";
import { Button } from "react-native-paper";
import { StackActions, useNavigation } from "@react-navigation/native";

export default function Contacts() {
  const { client, setActiveChannel } = useChatContext();
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const [users, setUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>(
    []
  ); // Store list of users
  const { onChangeSearchText, reset, results } = useUserSearchContext();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const navigation=useNavigation()
  const textColor = useThemeColor(
    {
      light: Colors.light.text,
      dark: Colors.dark.text,
    },
    "text"
  );

  const bgColor = useThemeColor(
    {
      light: Colors.light.background,
      dark: Colors.dark.background,
    },
    "background"
  );

  useEffect(() => {
    // Fetch a list of users from your database or Stream's API
    const fetchUsers = async () => {
      if (auth?.currentUser?.uid) {
        // Example: Fetch users excluding the current user
        const usersList = await client.queryUsers({
          name: { $eq: "adlerware@gmail.com" },
        });
        setUsers(usersList?.users);
      }
    };

    fetchUsers();
  }, [client]);

  // Handler for creating a new channel with the selected user
  const createNewChannel = async (selectedUser: any) => {
    try {
      if (auth?.currentUser?.uid) {
        // Create a new channel between the current user and the selected user
        const channel = client.channel("messaging", {
          members: [auth.currentUser.uid, selectedUser.id],
        });
        const result = await channel.create();
        setActiveChannel(channel);
        navigation.dispatch(StackActions.pop(1));
        router.push(`/channel/${channel.cid}`);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "New Chat",
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: textColor,
          },
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerSearchBarOptions: {
            placeholder: "search",
            textColor: Colors.dark.text,
            hintTextColor: Colors.light.icon,
            tintColor: Colors.light.primary,
            barTintColor: Colors.light.tabIconDefault,
            onChangeText(e) {
              onChangeSearchText(e.nativeEvent.text?.toLowerCase());
            },
            onFocus(e) {
              setIsSearchFocused(true);
            },
            onBlur() {
              setIsSearchFocused(false);
            },
          },
          headerRight: () => (
            <Button
              mode="contained"
              style={{
                backgroundColor: Colors.light.primary,
              }}
              textColor={Colors.dark.text}
              onPress={()=>router.push("/turboscreens/NewGroupChannelAddMemberScreen")}
            >
              New group
            </Button>
          ),
        }}
      />
      <View style={styles.usersWrapper}>
        <UserSearchResults
          toggleSelectedUser={(user) => {
            createNewChannel(user);
          }}
          showOnlineStatus
        />
      </View>
    </ThemedView>
  );
}

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    userItem: {
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingHorizontal: getPercent(3, width),
      paddingVertical: getPercent(1, height),
      gap: 10,
    },
    userName: {
      fontSize: 18,
    },
    userInfoWrapper: {
      backgroundColor: "transparent",
    },
    usersWrapper: {
      flex: 1,
      backgroundColor: "transparent",
      paddingTop: getPercent(16, height),
    },
  });
