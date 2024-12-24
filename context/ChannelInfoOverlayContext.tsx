import React, { useContext, useState } from 'react';

import type { ChannelContextValue } from 'stream-chat-expo';

import type { StackNavigatorParamList, StreamChatGenerics } from '@/types/types';



export type ChannelInfoOverlayData = Partial<
  Pick<ChannelContextValue<StreamChatGenerics>, 'channel'>
> & {
  clientId?: string;
  navigation?: any;
};

export type ChannelInfoOverlayContextValue = {
  reset: () => void;
  setData: React.Dispatch<React.SetStateAction<ChannelInfoOverlayData>>;
  data?: ChannelInfoOverlayData;
};

export const ChannelInfoOverlayContext = React.createContext({} as ChannelInfoOverlayContextValue);

type Props = React.PropsWithChildren<{
  value?: ChannelInfoOverlayContextValue;
}>;

export const ChannelInfoOverlayProvider = ({ children, value }: Props) => {
  const [data, setData] = useState(value?.data);

  const reset = () => {
    setData(value?.data);
  };

  const channelInfoOverlayContext = {
    data,
    reset,
    setData,
  };
  return (
    <ChannelInfoOverlayContext.Provider
      value={channelInfoOverlayContext as ChannelInfoOverlayContextValue}
    >
      {children}
    </ChannelInfoOverlayContext.Provider>
  );
};

export const useChannelInfoOverlayContext = () =>
  useContext(ChannelInfoOverlayContext) as unknown as ChannelInfoOverlayContextValue;
