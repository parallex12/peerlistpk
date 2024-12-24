import { useEffect, useRef, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet } from "react-native";

interface PushNotificationProviderProps {
  children: React.ReactNode;
  client: any; // Add the client prop here
}

export const PushNotificationProvider: React.FC<
  PushNotificationProviderProps
> = ({ children, client }) => {
  const [isReady, setIsReady] = useState(false);
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    try {
      // Register FCM token with stream chat server
      const registerPushToken = async () => {
        // Unsubscribe any previous listener
        unsubscribeTokenRefreshListenerRef.current?.();
        const token = await messaging().getToken();
        console.log("ypopp", "token", token);
        const push_provider = "firebase";
        const push_provider_name = "mantoschat"; // Optional alias for push provider

        client.addDevice(
          token,
          push_provider,
          client?.user?.id,
          push_provider_name
        );
        await AsyncStorage.setItem("@current_push_token", token);

        const removeOldToken = async () => {
          const oldToken = await AsyncStorage.getItem("@current_push_token");
          if (oldToken !== null) {
            await client.removeDevice(oldToken);
          }
        };
        unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
          async (newToken) => {
            await Promise.all([
              removeOldToken(),
              client.setLocalDevice(
                newToken,
                push_provider,
                "USER_ID",
                push_provider_name
              ),
              AsyncStorage.setItem("@current_push_token", newToken),
            ]);
          }
        );
      };

      const init = async () => {
        await requestPermission();
        await registerPushToken();
        setIsReady(true);
      };

      // Call the init function, but don't return a Promise directly from useEffect
      init();

      // Return a synchronous cleanup function
      return () => {
        // Cleanup logic without returning a promise
        client?.disconnectUser();
        unsubscribeTokenRefreshListenerRef.current?.();
      };
    } catch (e) {
      console.log(e);
    }
  }, [client]);

  if (!isReady) {
    return null;
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});
