// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router, Stack, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Button,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { SignUp } from "@/scripts/auth";
import { Colors } from "@/constants/Colors";
import { getPercent } from "@/scripts";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import AntDesign from "@expo/vector-icons/AntDesign";

const SignupPage = () => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const colorScheme = useColorScheme();
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  const handleSignup = async () => {
    if (!termsAccepted) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy to proceed."
      );
      return;
    }
    if (email != undefined && password != undefined) {
      setLoading(true);
      await SignUp({ email, password });
      setLoading(false);
    } else {
      setError("Something went wrong! Try again later.");
    }
  };

  const onAdlerware = async () => {
    await WebBrowser.openBrowserAsync("https://adlerware.net");
  };

  const onLogin = () => {
    router.push("/(auth)/login");
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
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="flat"
              textColor={Colors?.light.text}
              inputMode="text"
              underlineStyle={{
                backgroundColor: Colors.light.primaryMantos,
                height: 1,
              }}
              selectionColor={Colors.light.primaryMantos}
              textContentType="name"
            />
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="flat"
              textColor={Colors?.light.text}
              inputMode="text"
              underlineStyle={{
                backgroundColor: Colors.light.primaryMantos,
                height: 1,
              }}
              selectionColor={Colors.light.primaryMantos}
              textContentType="username"
            />

            <TextInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              mode="flat"
              textColor={Colors?.light.text}
              inputMode="numeric"
              underlineStyle={{
                backgroundColor: Colors.light.primaryMantos,
                height: 1,
              }}
              selectionColor={Colors.light.primaryMantos}
              textContentType="telephoneNumber"
            />
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
            <TextInput
              label="Password"
              value={password}
              underlineStyle={{
                backgroundColor: Colors.light.primaryMantos,
                height: 1,
              }}
              style={styles.input}
              onChangeText={setPassword}
              secureTextEntry
              mode="flat"
              textColor={Colors?.light.text}
              selectionColor={Colors.light.primaryMantos}
              textContentType="emailAddress"
            />
            <View style={styles.terms_accept}>
              <TouchableOpacity
                onPress={() => setTermsAccepted((prev) => !prev)}
                style={styles.radioBtn}
              >
                <AntDesign
                  name={termsAccepted ? "checksquare" : "checksquareo"}
                  size={18}
                  color={
                    termsAccepted ? Colors.light.primary : Colors.light.icon
                  }
                />
              </TouchableOpacity>
              <ThemedText type="link">
                I agree to the Terms of Service and Privacy Policy.
              </ThemedText>
            </View>
            <Button
              mode="contained"
              buttonColor={Colors.light.primaryMantos}
              textColor="#fff"
              onPress={handleSignup}
            >
              {loading ? <ActivityIndicator color="#fff" /> : "Sign up"}
            </Button>
          </View>
          <View style={styles.signupBtnWrapper}>
            <Button
              mode="contained"
              style={styles.signupBtn}
              shouldRasterizeIOS
              textColor={Colors.light.primary}
              onPress={onLogin}
            >
              {loading ? (
                <ActivityIndicator color="#222" />
              ) : (
                "I already have an account"
              )}
            </Button>
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

export default SignupPage;
