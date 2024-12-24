import axios from "axios";

export const getStreamToken = async ({ userId }: { userId: string }) => {
  const result = await axios.post("/getStreamToken", { userId });
  return result;
};
