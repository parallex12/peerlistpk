import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { getPercent } from "@/scripts";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import { RecoverForgotPass } from "@/scripts/auth";

const forgotpassword = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  const handleRecover = async () => {
    if (email != undefined) {
      setLoading(true);
      await RecoverForgotPass({ email });
      setLoading(false);
    } else {
      setError("Please enter your email.");
    }
  };

  const onAdlerware = async () => {
    await WebBrowser.openBrowserAsync("https://adlerware.net");
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={styles.innerCont}>
          <View style={styles.container}>
            {error && (
              <ThemedText style={{ color: "#db2727" }} type="link">
                {error}
              </ThemedText>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="flat"
              textColor={Colors?.light.text}
              inputMode="email"
              underlineStyle={{
                backgroundColor: Colors.light.primaryMantos,
                height: 1,
              }}
              selectionColor={Colors.light.primaryMantos}
              textContentType="emailAddress"
            />
            <Button
              mode="contained"
              buttonColor={Colors.light.primaryMantos}
              textColor="#fff"
              onPress={handleRecover}
            >
              {loading ? <ActivityIndicator color="#fff" /> : "Send reset link"}
            </Button>
          </View>
          <View style={styles.signupBtnWrapper}>
            <TouchableOpacity
              onPress={onAdlerware}
              style={styles.adlerwareCont}
            >
              <FontAwesome5
                name="earlybirds"
                size={15}
                color={Colors.light.icon}
              />
              <ThemedText
                type="defaultSemiBoldSmall"
                lightColor={Colors.light.icon}
                style={{ fontFamily: "SpaceMono" }}
              >
                ADLERWARE
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const _styles = (width: number, height: number) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.light.background,
    },
    innerCont: {
      flex: 1,
      height: getPercent(80, height),
    },
    input: {
      backgroundColor: "transparent",
    },
    logoWrapper: {
      width: "100%",
      height: getPercent(20, height),
      alignSelf: "center",
    },
    container: {
      paddingHorizontal: getPercent(3, width),
      flex: 1,
      width: "100%",
      gap: 16,
    },
    loginBtn: {
      backgroundColor: Colors.light.primaryMantos,
      height: getPercent(5, height),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
    },
    signupBtnWrapper: {
      paddingHorizontal: getPercent(3, width),
      flex: 0.5,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 15,
    },
    signupBtn: {
      height: getPercent(5, height),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: Colors.light.primary,
    },
    adlerwareCont: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    terms_accept: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    radioBtn: {
      borderRadius: 100,
    },
  });

export default forgotpassword;
