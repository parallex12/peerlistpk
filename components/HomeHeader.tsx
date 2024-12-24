import React, { ReactNode } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import BlurTabBarBackground from "./ui/TabBarBackground.ios";
import { getPercent } from "@/scripts";
import { IconButton, MD3Colors } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { SignOut } from "@/scripts/auth";

interface HomeHeaderProps {
  onDotsPress?: () => void;
  onPlusPress?: () => void;
  client: any;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onDotsPress,
  onPlusPress,
  client,
}) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const router = useRouter();
  const onLogout = () => SignOut();

  return (
    <ThemedView style={styles.container}>
      <BlurTabBarBackground/>
      <IconButton
        icon={"dots-horizontal"}
        iconColor={MD3Colors.neutral10}
        size={15}
        onPress={onLogout}
        mode="contained"
        containerColor="#e5e5e5"
      />
      {/* <ThemedText type="defaultSemiBold">Chats</ThemedText> */}
      <IconButton
        icon={"plus"}
        iconColor={MD3Colors.tertiary99}
        size={15}
        onPress={() => router.push("/contacts")}
        mode="contained"
        containerColor={Colors?.light.primary}
      />
    </ThemedView>
  );
};

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: getPercent(5, height),
      paddingBottom: getPercent(0.5, height),
      paddingHorizontal: getPercent(1, width),
      position:'absolute',
      zIndex:999,
      width:'100%',
      backgroundColor:'transparent',
    },
  });
export default HomeHeader;
