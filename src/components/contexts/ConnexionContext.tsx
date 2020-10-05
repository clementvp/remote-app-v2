import React, { useCallback, useEffect, useState } from "react";
import {
  initSocket,
  subscribeToServer,
  subscribeToConnexionError,
} from "../../services/SocketService";
import {
  resetStorageLastConnexion,
  retrieveStorageLastConnexion,
} from "../../services/StorageService";

type ContextProps = {
  connected: boolean;
  loading: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ConnexionContext = React.createContext<ContextProps>({
  connected: false,
  loading: false,
  setConnected: () => {},
  setLoading: () => {},
});

export const ConnexionProvider = ({ children }: any) => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const reConnect = useCallback(
    (address: string) => {
      setLoading(true);
      initSocket(address);
      subscribeToServer(async () => {
        setLoading(false);
        setConnected(true);
      });
      subscribeToConnexionError(async () => {
        setLoading(false);
        await resetStorageLastConnexion();
      });
    },
    [setConnected]
  );

  useEffect(() => {
    const fn = async () => {
      const last = await retrieveStorageLastConnexion();
      if (last && last !== "") {
        reConnect(last);
      }
    };
    fn();
  }, [reConnect]);

  return (
    <ConnexionContext.Provider
      value={{ connected, loading, setConnected, setLoading }}
    >
      {children}
    </ConnexionContext.Provider>
  );
};
