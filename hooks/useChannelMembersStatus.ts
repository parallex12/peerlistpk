import { useEffect, useState } from 'react';

import { getUserActivityStatus } from '@/utils/getUserActivityStatus';

import type { Channel } from 'stream-chat';

import type { StreamChatGenerics } from '@/types/types';
import { useChatContext } from 'stream-chat-expo';

export const useChannelMembersStatus = (channel: Channel<StreamChatGenerics>) => {
  const watchersCount = channel.state.watcher_count;
  const memberCount = channel?.data?.member_count;

  const getStatus = () => {
    let newStatus = '';
    const isOneOnOneConversation = memberCount === 2 && channel.id?.indexOf('!members-') === 0;

    if (isOneOnOneConversation) {
      const result = Object.values({ ...channel.state.members }).find(
        (member) => member.user?.id !== chatClient?.user?.id,
      );

      return (newStatus = getUserActivityStatus(result?.user));
    } else {
      const memberCountText = `${memberCount} Members`;
      const onlineCountText = watchersCount > 0 ? `${watchersCount} Online` : '';

      newStatus = `${[memberCountText, onlineCountText].join(',')}`;

      return newStatus;
    }
  };

  const [status, setStatus] = useState(getStatus());
  const { client:chatClient } = useChatContext();

  useEffect(() => {
    setStatus(getStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchersCount, memberCount, chatClient]);

  return status;
};
