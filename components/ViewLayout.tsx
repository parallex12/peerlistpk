import React, { PropsWithChildren } from "react";
import { ThemedView } from "./ThemedView";
import { StyleSheet, useWindowDimensions, ViewProps } from "react-native";
import { getPercent } from "@/scripts";

const ViewLayout: React.FC<ViewProps> = ({ style, ...props }) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  return (
    <ThemedView style={[style]} {...props}>
      {props?.children}
    </ThemedView>
  );
};

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    default: {
      flex: 1,
      backgroundColor: "transparent",
    },
  });

export default ViewLayout;
