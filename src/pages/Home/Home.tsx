import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, linkOutline, trashOutline } from "ionicons/icons";
import React, { useCallback, useContext, useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router";
import { Plugins } from "@capacitor/core";

import { ConnexionContext } from "../../components/contexts/ConnexionContext";
import { ServerContext } from "../../components/contexts/ServersContext";
import { ServerItem } from "../../types/ServerItem";
import {
  addStorageLastConnexion,
  resetStorageLastConnexion,
  retrieveStorageLastConnexion,
} from "../../services/StorageService";
import {
  initSocket,
  subscribeToConnexionError,
  subscribeToServer,
} from "../../services/SocketService";

import styles from "./Home.module.scss";

const { App } = Plugins;

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const { connected, loading, setConnected, setLoading } = useContext(
    ConnexionContext
  );
  const { serverList, deleteServer } = useContext(ServerContext);

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
    [setConnected, setLoading]
  );

  useEffect(() => {
    const listner = App.addListener("appStateChange", async (state) => {
      if (state.isActive) {
        const last = await retrieveStorageLastConnexion();
        if (last && last !== "") {
          reConnect(last);
        }
      }
    });
    return () => {
      listner.remove();
    };
  }, [reConnect, setConnected]);

  const connect = (address: string) => {
    setLoading(true);
    initSocket(address);
    subscribeToServer(async () => {
      setLoading(false);
      await addStorageLastConnexion(address);
      setConnected(true);
    });
    subscribeToConnexionError(async () => {
      setLoading(false);
      await resetStorageLastConnexion();
    });
  };

  if (connected) {
    return <Redirect to="/controls"></Redirect>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle>Servers List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading}></IonLoading>
        {serverList.map((item: ServerItem) => {
          return (
            <IonItemSliding key={item.id}>
              <IonItem className={styles.items} lines="none">
                <IonLabel>
                  {item.name} ({item.address})
                </IonLabel>
                <IonButton
                  onClick={() => {
                    connect(item.address);
                  }}
                >
                  <IonIcon icon={linkOutline} /> &nbsp; Connect
                </IonButton>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption
                  color="danger"
                  onClick={() => {
                    deleteServer(item.id);
                  }}
                >
                  <IonIcon icon={trashOutline} />
                  &nbsp; Delete
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              history.push("/create");
            }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
