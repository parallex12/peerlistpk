import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { getPercent } from "@/scripts";
import { Searchbar } from "react-native-paper";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

interface HomeSearchHeaderProps {
  placeholder: string;
}

const HomeSearchHeader: React.FC<HomeSearchHeaderProps> = ({ placeholder }) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      {/* <ThemedText type="title">
        Chats
      </ThemedText> */}
      <Searchbar
        placeholder={placeholder}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.input}
        placeholderTextColor={Colors?.light.icon}
      />
    </View>
  );
};

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      gap: 10,
      paddingHorizontal: getPercent(3, width),
    },
    searchBar: {
      backgroundColor: "#e5e5e5",
      height: getPercent(5, height),
    },
    input: {
      color: Colors?.light.text,
    },
  });
export default HomeSearchHeader;
