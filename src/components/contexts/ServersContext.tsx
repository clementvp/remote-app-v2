import React, { useEffect, useState } from "react";
import checkStorage, {
  addServer,
  removeServer,
  retrieveServerList,
} from "../../services/StorageService";
import { ServerItem } from "../../types/ServerItem";

type ContextProps = {
  serverList: Array<ServerItem>;
  createServer: (id: string, name: string, address: string) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
};

export const ServerContext = React.createContext<ContextProps>({
  serverList: [],
  createServer: () => {
    return new Promise((resolve, reject) => {});
  },
  deleteServer: () => {
    return new Promise((resolve, reject) => {});
  },
});

export const ServerProvider = ({ children }: any) => {
  const [serverList, setServerList] = useState<Array<ServerItem>>([]);

  useEffect(() => {
    const fn = async () => {
      await checkStorage();
      await getServerList();
    };
    fn();
  }, []);

  const getServerList = async () => {
    const list = await retrieveServerList();
    if (list) {
      setServerList(list);
    }
  };

  const createServer = async (id: string, name: string, address: string) => {
    await addServer(id, name, address);
    await getServerList();
  };

  const deleteServer = async (id: string) => {
    await removeServer(id);
    await getServerList();
  };

  return (
    <ServerContext.Provider value={{ serverList, createServer, deleteServer }}>
      {children}
    </ServerContext.Provider>
  );
};
