import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import {
  Check,
  generateRandomId,
  useChatContext,
  useTheme,
  useViewport,
} from "stream-chat-expo";

import { RoundButton } from "@/streamComponents/RoundButton";
import { ScreenHeader } from "@/streamComponents/ScreenHeader";
import { UserSearchResults } from "@/streamComponents/UserSearch/UserSearchResults";
import { useUserSearchContext } from "@/context/UserSearchContext";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { IconButton } from "react-native-paper";
import { StackActions, useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  absolute: { position: "absolute" },
  container: {
    flex: 1,
  },
  gradient: {
    height: 24,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  header: {
    borderBottomWidth: 0,
  },
  inputBox: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingHorizontal: 16,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: "center", // for android vertical text centering
  },
  inputBoxContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  memberLength: { fontSize: 12 },
  nameText: {
    fontSize: 12,
    textAlignVertical: "center",
  },
});

type ConfirmButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
};

const ConfirmButton: React.FC<ConfirmButtonProps> = (props) => {
  const { disabled, onPress } = props;
  const {
    theme: {
      colors: { accent_blue, grey },
    },
  } = useTheme();

  return (
    <RoundButton disabled={disabled} onPress={onPress}>
      <Check pathFill={!disabled ? accent_blue : grey} />
    </RoundButton>
  );
};

const NewGroupChannelAssignNameScreen: React.FC = () => {
  const { client: chatClient,setActiveChannel } = useChatContext();
  const { selectedUserIds, selectedUsers,setSelectedUsers,reset } = useUserSearchContext();
  const [loading, setLoading] = useState(false);
  const {
    theme: {
      colors: {
        bg_gradient_end,
        bg_gradient_start,
        black,
        border,
        grey,
        white_snow,
      },
    },
  } = useTheme();
  const { vw } = useViewport();

  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  if (!chatClient) {
    return null;
  }
  const onConfirm = async() => {
    if (!chatClient.user || !selectedUsers || !groupName) {
      return;
    }
    setLoading(true);
    const channel = chatClient.channel("messaging", generateRandomId(), {
      members: [...selectedUserIds, chatClient.user?.id],
      name: groupName,
    });
    const result = await channel.create();
    reset()
    setLoading(false);
    setActiveChannel(channel);
    navigation.dispatch(StackActions.pop(3));
    router.push(`/channel/${channel.cid}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Name of Group Chat",
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
              loading={loading}
              icon="check"
              iconColor={Colors.dark.text}
              size={20}
              mode="contained"
              style={{
                backgroundColor: Colors.light.primary,
              }}
              onPress={onConfirm}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <View
          style={[
            styles.inputBoxContainer,
            {
              backgroundColor: white_snow,
              borderColor: border,
            },
          ]}
        >
          <Text style={[styles.nameText, { color: grey }]}>NAME</Text>
          <TextInput
            autoFocus
            onChangeText={setGroupName}
            placeholder="Choose a group chat name"
            placeholderTextColor={grey}
            style={[
              styles.inputBox,
              {
                color: black,
              },
            ]}
            value={groupName}
          />
        </View>
        <View style={styles.gradient}>
          <Svg height={24} style={styles.absolute} width={vw(100)}>
            <Rect
              fill="url(#gradient)"
              height={24}
              width={vw(100)}
              x={0}
              y={0}
            />
            <Defs>
              <LinearGradient
                gradientUnits="userSpaceOnUse"
                id="gradient"
                x1={0}
                x2={0}
                y1={0}
                y2={24}
              >
                <Stop
                  offset={1}
                  stopColor={bg_gradient_start}
                  stopOpacity={1}
                />
                <Stop offset={0} stopColor={bg_gradient_end} stopOpacity={1} />
              </LinearGradient>
            </Defs>
          </Svg>
          <Text
            style={[
              styles.memberLength,
              {
                color: grey,
              },
            ]}
          >
            {selectedUsers.length} Members
          </Text>
        </View>
        {selectedUsers.length >= 0 && (
          <UserSearchResults
            groupedAlphabetically={false}
            removeOnPressOnly
            results={selectedUsers}
            showOnlineStatus={false}
          />
        )}
      </View>
    </View>
  );
};
export default NewGroupChannelAssignNameScreen;
