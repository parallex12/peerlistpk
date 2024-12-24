import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Spinner, useTheme } from "stream-chat-expo";
import { ThemedText } from "./ThemedText";
import { getPercent } from "@/scripts";

export const NetworkDownIndicator: React.FC = () => {
  const { height, width } = useWindowDimensions();
  const styles = _styles({ width, height });
  return (
    <View style={styles.networkDownContainer} testID="network-down-indicator">
      <Spinner height={12} style={styles.spinner} width={12} />
      <ThemedText type="default">Searching for Network</ThemedText>
    </View>
  );
};

const _styles = ({ width, height }: any) =>
  StyleSheet.create({
    networkDownContainer: {
      top: getPercent(21, height),
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 5,
      backgroundColor:'transparent'
    },
    networkDownText: {
      fontSize: 12,
      marginLeft: 4,
    },
    networkDownTextLarge: {
      fontSize: 16,
      fontWeight: "700",
    },
    spinner: {
        backgroundColor:'transparent'
    },
  });
