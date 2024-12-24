import { useEffect, useRef, useState } from "react";

import type { Channel, MessageResponse } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-expo";

export const usePaginatedAttachments = (
  channel: Channel<DefaultStreamChatGenerics>,
  attachmentType: string
) => {
  const { client: chatClient } = useChatContext();
  const offset = useRef(0);
  const hasMoreResults = useRef(true);
  const queryInProgress = useRef(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<
    MessageResponse<DefaultStreamChatGenerics>[]
  >([]);

  const fetchAttachments = async () => {
    if (queryInProgress.current) {
      return;
    }

    setLoading(true);

    try {
      queryInProgress.current = true;

      offset.current = offset.current + messages.length;

      if (!hasMoreResults.current) {
        queryInProgress.current = false;
        setLoading(false);
        return;
      }

      // TODO: Use this when support for attachment_type is ready.
      const res = await chatClient?.search(
        {
          cid: { $in: [channel.cid] },
        },
        { "attachments.type": { $in: [attachmentType] } },
        {
          limit: 10,
          offset: offset.current,
        }
      );

      const newMessages = res?.results.map((r) => r.message);

      if (!newMessages) {
        queryInProgress.current = false;
        setLoading(false);
        return;
      }

      setMessages((existingMessages) => existingMessages.concat(newMessages));

      if (newMessages.length < 10) {
        hasMoreResults.current = false;
      }
    } catch (e) {
      // do nothing;
    }
    queryInProgress.current = false;
    setLoading(false);
  };

  const loadMore = () => {
    fetchAttachments();
  };

  useEffect(() => {
    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    loadMore,
    messages,
  };
};
