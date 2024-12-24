import React, { ReactNode } from "react";
import { Text, StyleSheet } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.rightAction}>Text</Text>
    </Reanimated.View>
  );
}

interface SwipeableChatCardProps {
  children: ReactNode;
}

const SwipeableChatCard: React.FC<SwipeableChatCardProps> = ({ children }) => {
  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={10}
      renderRightActions={RightAction}
    >
      {children}
    </ReanimatedSwipeable>
  );
};

export default SwipeableChatCard;

const styles = StyleSheet.create({
  rightAction: {
    width:100,
    height: "100%",
    backgroundColor: "#db2727",
  },
  separator: {
    width: "100%",
  },
  swipeable: {},
});
