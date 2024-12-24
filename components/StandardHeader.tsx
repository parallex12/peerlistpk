import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import BlurTabBarBackground from "./ui/TabBarBackground.ios";
import { getPercent } from "@/scripts";
import { ThemedText } from "./ThemedText";
interface StandardHeaderProps {
  title?: string;
}

const StandardHeader: React.FC<StandardHeaderProps> = ({ title }) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  return (
    <ThemedView style={styles.container}>
      <BlurTabBarBackground />
      <ThemedText type="title">{title}</ThemedText>
    </ThemedView>
  );
};

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: getPercent(8, height),
      paddingBottom: getPercent(1, height),
      paddingHorizontal: getPercent(5, width),
      backgroundColor: "transparent",
      width: "100%",
      position: "absolute",
      zIndex: 9999,
    },
  });
export default StandardHeader;
