// app/login.tsx
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { getPercent } from "@/scripts";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";
import { Button, IconButton } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { auth } from "@/services/firebase";

const CButton = (props: any) => {
  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  return (
    <TouchableOpacity style={styles.btn} onPress={props?.onPress}>
      <MaterialCommunityIcons
        name={props?.icon}
        size={24}
        color={props?.iconColor}
      />

      <ThemedText type="default" lightColor={Colors.light.text}>
        {props?.loading ? "Connecting..." : props?.title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const Onboarding = () => {
  const [loading, setLoading] = useState({
    isFacebook: false,
    isInstagram: false,
    isGuest: false,
  });

  const { height, width } = useWindowDimensions();
  const styles = _styles(width, height);

  const onAdlerware = async () => {
    await WebBrowser.openBrowserAsync("https://adlerware.net");
  };

  const onSignup = () => {
    router.push("/(auth)/signup");
  };

  const onGuestLogin = async () => {
    setLoading((prev) => ({ ...prev, isGuest: true }));
    await auth
      .signInAnonymously()
      .then((res) => setLoading((prev) => ({ ...prev, isGuest: true })))
      .catch((e) => setLoading((prev) => ({ ...prev, isGuest: false })));
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/4204968.jpg")}
          style={{ width: "100%", height: getPercent(50, height) }}
          resizeMode="cover"
        />
        <View style={styles.centeredCont}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
          />
          <ThemedText
            type="title"
            style={styles.titleText}
            lightColor={Colors.light.primaryMantos}
          >
            Stay connected, anytime, anywhere
          </ThemedText>
        </View>
      </View>
      <View style={styles.BtnWrapper}>
        <CButton
          iconColor={Colors.light.primary}
          icon="google"
          loading={loading?.isFacebook}
          title="Continue with gmail"
        />
        <CButton
          iconColor={Colors.light.icon}
          loading={loading?.isGuest}
          icon="location-enter"
          title="Continue as Guest"
          onPress={onGuestLogin}

        />

        <TouchableOpacity onPress={onAdlerware} style={styles.adlerwareCont}>
          <FontAwesome5 name="earlybirds" size={15} color={Colors.light.icon} />
          <ThemedText
            type="link"
            lightColor={Colors.light.icon}
            style={{ fontSize: 12, fontFamily: "SpaceMono" }}
          >
            adlerware.inc
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
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    centeredCont: {
      alignItems: "center",
      justifyContent: "center",
    },
    BtnWrapper: {
      paddingHorizontal: getPercent(5, width),
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: 15,
    },
    btn: {
      width: "100%",
      height: getPercent(5, height),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.light.border,
      fontSize: 40,
      gap: 10,
    },
    adlerwareCont: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    titleText: {
      textAlign: "center",
      lineHeight: 35,
      letterSpacing: 0.3,
    },
  });

export default Onboarding;
