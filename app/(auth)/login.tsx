// app/login.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { SignIn } from "@/scripts/auth";
import { Colors } from "@/constants/Colors";
import { getPercent } from "@/scripts";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";

const LoginPage = () => {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  const handleLogin = async () => {
    if (email != undefined && password != undefined) {
      setLoading(true);
      await SignIn({ email, password });
      setLoading(false);
    } else {
      setError("Invalid credentials");
    }
  };
  
  const onAdlerware = async () => {
    await WebBrowser.openBrowserAsync("https://adlerware.net");
  };

  const handleForgotPass = async () => {
    router.push("/");
  };

  const onSignup = () => {
    router.push("/(auth)/signup");
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/images/icon.png")}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        {error && (
          <ThemedText style={{ color: "#db2727" }} type="default">
            {error}
          </ThemedText>
        )}
        <TextInput
          label={<ThemedText type="link">Email</ThemedText>}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="flat"
          textColor={Colors?.light.text}
          underlineStyle={{
            backgroundColor: Colors.light.primary,
            height: 1,
          }}
          activeOutlineColor={Colors?.light.primary}
          inputMode="email"
          selectionColor={Colors.light.primary}
          textContentType="emailAddress"
        />
        <TextInput
          label={<ThemedText type="link">Password</ThemedText>}
          value={password}
          underlineStyle={{
            backgroundColor: Colors.light.primary,
            height: 1,
          }}
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          mode="flat"
          activeOutlineColor={Colors?.light.primary}
          textColor={Colors?.light.text}
          selectionColor={Colors.light.primary}
          textContentType="password"
        />
        <Button
          mode="contained"
          buttonColor={Colors.light.primaryMantos}
          textColor="#fff"
          onPress={handleLogin}
        >
          {loading ? <ActivityIndicator color="#fff" /> : "Log in"}
        </Button>
        <TouchableOpacity onPress={handleForgotPass}>
          <ThemedText style={{ alignSelf: "center" }} type="link">
            Forgot Password?
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.signupBtnWrapper}>
        <TouchableOpacity style={styles.signupBtn} onPress={onSignup}>
          {loading ? (
            <ActivityIndicator color="#222" />
          ) : (
            <ThemedText
              type="defaultSemiBoldSmall"
              lightColor={Colors.light.primary}
            >
              Create new account
            </ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onAdlerware} style={styles.adlerwareCont}>
          <FontAwesome5 name="earlybirds" size={15} color={Colors.light.icon} />
          <ThemedText
            type="defaultSemiBoldSmall"
            lightColor={Colors.light.icon}
            style={{ fontFamily: "SpaceMono" }}
          >
            ADLERWARE
          </ThemedText>
        </TouchableOpacity>
      </View>
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
      justifyContent: "center",
      width: "100%",
      gap: 16,
    },
    loginBtn: {
      width:'100%',
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
      width: "100%",
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
  });

export default LoginPage;
