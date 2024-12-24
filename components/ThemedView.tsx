import { StatusBar, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  children,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor || Colors.light.background,
      dark: darkColor || Colors.dark.background,
    },
    "background"
  );

  return (
    <View style={[{ backgroundColor }, style]} {...otherProps}>
      <StatusBar barStyle="dark-content" />
      {children}
    </View>
  );
}
