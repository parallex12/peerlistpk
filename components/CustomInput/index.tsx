import { Button, StyleSheet } from "react-native";
import {
  AutoCompleteInput,
  FileUploadPreview,
  ImageUploadPreview,
  useMessageInputContext,
} from "stream-chat-expo";
import { ThemedView } from "@/components/ThemedView";

const CustomInput = () => {
  const { sendMessage, text, toggleAttachmentPicker, openCommandsPicker } =
    useMessageInputContext();
  return (
    <ThemedView style={styles.fullWidth}>
      <ImageUploadPreview />
      <FileUploadPreview />
      <ThemedView style={[styles.fullWidth, styles.inputContainer]}>
        <AutoCompleteInput />
      </ThemedView>
      <ThemedView style={[styles.fullWidth, styles.row]}>
        <Button title="Attach" onPress={toggleAttachmentPicker} />
        <Button title="Commands" onPress={openCommandsPicker} />
        <Button title="Send" disabled={!text} />
      </ThemedView>
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  flex: { flex: 1 },
  fullWidth: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    height: 40,
  },
});
export default CustomInput;
