import { ReactNode, useEffect, useRef, useState } from "react";
import { auth } from "@/services/firebase";
import { getStreamToken } from "@/services/streamChat";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chat, OverlayProvider, useCreateChatClient } from "stream-chat-expo";

interface ChatWrapperProps {
  children: ReactNode;
}

const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: "transparent",
    },
  },
};

export const ChatWrapper: React.FC<ChatWrapperProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  // Request push notification permission
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Push notification permission granted:", authStatus);
    } else {
      console.warn("Push notification permission denied.");
    }
  };

  const registerPushToken = async (client: any) => {
    try {
      // Unsubscribe any previous listener
      unsubscribeTokenRefreshListenerRef.current?.();
      // Ensure the device is registered for remote messages
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      const push_provider = "firebase";
      const push_provider_name = "mantoschat";
      console.log(token, "push");
      // Set local device with the token
      await client.setLocalDevice({
        id: token,
        push_provider,
        push_provider_name,
      });

      // Store token in AsyncStorage
      await AsyncStorage.setItem("@current_push_token", token);

      // Remove old token logic
      const removeOldToken = async () => {
        const oldToken = await AsyncStorage.getItem("@current_push_token");
        if (oldToken !== null) {
          await client.removeDevice(oldToken);
        }
      };

      // Handle token refresh
      unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
        async (newToken) => {
          await Promise.all([
            removeOldToken(),
            client.addDevice(
              newToken,
              push_provider,
              userId,
              push_provider_name
            ),
            AsyncStorage.setItem("@current_push_token", newToken),
          ]);
        }
      );
    } catch (error) {
      console.error("Error registering push token:", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        router.push("/(auth)/onboarding");
        return;
      }

      setUserId(firebaseUser.uid);
      setUserName(firebaseUser.displayName || firebaseUser.email);

      try {
        const response = await getStreamToken({ userId: firebaseUser.uid });
        const token = response.data?.token;
        setUserToken(token);
      } catch (error) {
        console.error("Error fetching Stream token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();

    return () => {
      unsubscribeTokenRefreshListenerRef.current?.();
    };
  }, [router]);

  const chatClient = useCreateChatClient({
    apiKey: "krfumucs8eqj",
    userData: {
      id: userId || "",
      name: userName || "",
    },
    tokenOrProvider: userToken,
  });

  useEffect(() => {
    if (chatClient && userToken) {
      const initializeClient = async () => {
        await requestPermission();
        await registerPushToken(chatClient);

        try {
          await chatClient.connectUser(
            { id: userId || "", name: userName || "" },
            userToken
          );
        } catch (error) {
          console.error("Error connecting user:", error);
        }
      };

      initializeClient();

      return () => {
        chatClient.disconnectUser();
      };
    }
  }, [chatClient, userId, userName, userToken]);

  if (loading || !chatClient) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={chatClient} enableOfflineSupport>
        {children}
      </Chat>
    </OverlayProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
