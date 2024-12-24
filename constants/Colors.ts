/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3LightTheme, MD3DarkTheme,DefaultTheme } from "react-native-paper";

const tintColorLight = "#151718";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C", // Primary text color
    background: "#FFFFFF", // App background color
    tint: "#151718", // Tint color for active elements
    icon: "#687076", // Icon default color
    tabIconDefault: "#687076", // Default tab icon color
    tabIconSelected: "#151718", // Selected tab icon color
    primary: "#007aff", // Primary button or action color
    primaryLight: "#4682b4", // Primary button or action color
    primaryMantos:"#1d3469",
    border: "#E0E0E0", // Border color
    error: "#FF3B3B", // Error color
    success: "#4CAF50", // Success indicator
    disabled: "#CCCCCC", // Disabled element color
    surface: "#F8F8F8", // Card-like surfaces,
    instagramGradient: ['#F58529', '#DD2A7B', '#8134AF', '#515BD4'], // Gradient colors
  },
  dark: {
    text: "#ECEDEE", // Primary text color
    background: "#151718", // App background color
    tint: "#FFFFFF", // Tint color for active elements
    icon: "#9BA1A6", // Icon default color
    tabIconDefault: "#9BA1A6", // Default tab icon color
    tabIconSelected: "#FFFFFF", // Selected tab icon color
    primary: "rgb(0, 122, 255)", // Primary button or action color
    border: "#2C2C2C", // Border color
    error: "#FF6B6B", // Error color
    success: "#4CAF50", // Success indicator
    disabled: "#555555", // Disabled element color
    surface: "#1E1E1E", // Card-like surfaces
    primaryMantos:"#1d3469",
  },
  Md:{
    ...MD3LightTheme.colors
  }
};
