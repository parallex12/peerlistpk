import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowRight, Search, useChatContext, useTheme } from "stream-chat-expo";

import { UserGridItem } from "@/streamComponents/UserSearch/UserGridItem";
import { UserSearchResults } from "@/streamComponents/UserSearch/UserSearchResults";
import { useUserSearchContext } from "@/context/UserSearchContext";

import type { StackNavigatorParamList } from "@/types/types";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { IconButton } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: { paddingBottom: 16 },
  inputBox: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingHorizontal: 16,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: "center", // for android vertical text centering
  },
  inputBoxContainer: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: 8,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navigationButton: {
    paddingRight: 8,
  },
  userGridItemContainer: { marginHorizontal: 8, width: 64 },
});

type RightArrowButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
};

const RightArrowButton: React.FC<RightArrowButtonProps> = (props) => {
  const { disabled, onPress } = props;

  const {
    theme: {
      colors: { accent_blue },
    },
  } = useTheme();

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.navigationButton}
    >
      <ArrowRight pathFill={disabled ? "transparent" : accent_blue} />
    </TouchableOpacity>
  );
};

const NewGroupChannelAddMemberScreen: React.FC = () => {
  const { client: chatClient } = useChatContext();

  const {
    theme: {
      colors: { black, border, grey, white },
    },
  } = useTheme();

  const {
    onChangeSearchText,
    onFocusInput,
    removeUser,
    reset,
    searchText,
    selectedUsers,
  } = useUserSearchContext();
  const router = useRouter();

  const onRightArrowPress = () => {
    if (selectedUsers.length === 0) {
      return;
    }
    router.push('/turboscreens/NewGroupChannelAssignNameScreen');
  };

  if (!chatClient) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add Members",
          headerShown: true,
          headerTransparent: false,
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerBlurEffect: "light",
          headerTitleStyle: {
            color: Colors.light.text,
          },
          headerRight: () => (
            <IconButton
              icon="chevron-right"
              iconColor={Colors.dark.text}
              size={20}
              mode="contained"
              style={{
                backgroundColor: Colors.light.primary,
              }}
              onPress={onRightArrowPress}
            />
          ),
        }}
      />
      <View>
        <View
          style={[
            styles.inputBoxContainer,
            {
              backgroundColor: white,
              borderColor: border,
              marginBottom: selectedUsers.length === 0 ? 8 : 16,
            },
          ]}
        >
          <Search pathFill={black} />
          <TextInput
            onChangeText={onChangeSearchText}
            onFocus={onFocusInput}
            placeholder="Search"
            placeholderTextColor={grey}
            style={[
              styles.inputBox,
              {
                color: black,
              },
            ]}
            value={searchText}
          />
        </View>
        <FlatList
          data={selectedUsers}
          horizontal
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ index, item: user }) => (
            <View style={styles.userGridItemContainer}>
              <UserGridItem
                onPress={() => {
                  removeUser(index);
                }}
                user={user}
              />
            </View>
          )}
          style={selectedUsers.length ? styles.flatList : {}}
        />
      </View>
      <UserSearchResults />
    </View>
  );
};
export default NewGroupChannelAddMemberScreen;
