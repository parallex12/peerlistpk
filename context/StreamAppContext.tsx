//StreamAppContext.tsx
import React, { ReactNode, useState } from "react";

export const StreamAppContext = React.createContext({
  channel: null,
  setChannel: (channel: any) => {},
});

interface StreamAppProviderProps {
  children: ReactNode;
}

export const StreamAppProvider: React.FC<StreamAppProviderProps> = ({
  children,
}) => {
  const [channel, setChannel] = useState(null);

  return (
    <StreamAppContext.Provider value={{ channel, setChannel }}>
      {children}
    </StreamAppContext.Provider>
  );
};

export const useStreamAppContext = () => React.useContext(StreamAppContext);
