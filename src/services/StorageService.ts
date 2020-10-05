import { ServerItem } from "../types/ServerItem";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

let serverList: Array<ServerItem> = [];

const checkStorage = async () => {
  const { keys } = await Storage.keys();
  const findServerList = keys.find((element) => {
    return element === "remoteApp";
  });
  const findLastConnexion = keys.find((element) => {
    return element === "remoteAppLastConnexion";
  });
  await setStorageServer(findServerList);
  await setStorageLastConnexion(findLastConnexion);
};

const setStorageServer = async (result: string | undefined) => {
  if (!result) {
    await Storage.set({
      key: "remoteApp",
      value: JSON.stringify({
        list: [],
      }),
    });
  }
};

const setStorageLastConnexion = async (result: string | undefined) => {
  if (!result) {
    await Storage.set({
      key: "remoteAppLastConnexion",
      value: JSON.stringify({
        connexion: "",
      }),
    });
  }
};

const resetStorageLastConnexion = async () => {
  await Storage.set({
    key: "remoteAppLastConnexion",
    value: JSON.stringify({
      connexion: "",
    }),
  });
};

const addStorageLastConnexion = async (address: string) => {
  await Storage.set({
    key: "remoteAppLastConnexion",
    value: JSON.stringify({
      connexion: address,
    }),
  });
};

const retrieveStorageLastConnexion = async () => {
  const ret = await Storage.get({ key: "remoteAppLastConnexion" });
  if (ret.value) {
    const value = JSON.parse(ret.value);
    return value.connexion;
  }
};

const retrieveServerList = async () => {
  const ret = await Storage.get({ key: "remoteApp" });
  if (ret.value) {
    const value = JSON.parse(ret.value);
    serverList = value.list;
    return serverList;
  }
};

const addServer = async (id: string, name: string, address: string) => {
  serverList.push({ id, name, address });
  await Storage.set({
    key: "remoteApp",
    value: JSON.stringify({
      list: serverList,
    }),
  });
};

const removeServer = async (id: string) => {
  const servers = serverList.filter((element: ServerItem) => {
    return element.id !== id;
  });
  serverList = servers;
  await Storage.set({
    key: "remoteApp",
    value: JSON.stringify({
      list: servers,
    }),
  });
};

export default checkStorage;
export {
  retrieveServerList,
  addServer,
  removeServer,
  addStorageLastConnexion,
  retrieveStorageLastConnexion,
  resetStorageLastConnexion,
};
