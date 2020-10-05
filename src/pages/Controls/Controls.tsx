import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Plugins } from "@capacitor/core";
import { useGesture } from "react-use-gesture";

import { ConnexionContext } from "../../components/contexts/ConnexionContext";
import { resetStorageLastConnexion } from "../../services/StorageService";
import {
  disconnectSocket,
  subscribeToDisconnectServer,
} from "../../services/SocketService";
import { cogOutline, lockClosedOutline, logOutOutline } from "ionicons/icons";
import {
  detectDrag,
  detectVerticalSwipe,
  tap,
} from "../../services/DetectGestures";
import { lockComputer } from "../../services/Commands";

import styles from "./Controls.module.scss";

const { App } = Plugins;

const Controls: React.FC = (props) => {
  const { connected, setConnected } = useContext(ConnexionContext);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [previousY, setPreviousY] = useState(0);
  const [triggerY, setTriggerY] = useState(0);

  useEffect(() => {
    const listner = App.addListener("appStateChange", (state) => {
      if (!state.isActive) {
        disconnectSocket();
      }
    });
    return () => {
      listner.remove();
    };
  }, []);

  useEffect(() => {
    subscribeToDisconnectServer(() => {
      setConnected(false);
    });
  });

  const bind = useGesture(
    {
      onDragStart: (state) => {
        setStartX(state.movement[0]);
        setStartY(state.movement[1]);
        setPreviousY(state.movement[1]);
        setTriggerY(state.movement[1]);
      },
      onDrag: (state) => {
        detectVerticalSwipe(
          state.movement[1],
          triggerY,
          previousY,
          setTriggerY,
          setPreviousY
        );
      },
      onDragEnd: (state) => {
        detectDrag(state.movement[0], state.movement[1], startX, startY);
      },
      onDoubleClick: () => {
        tap();
      },
    },
    {
      drag: {
        lockDirection: true,
        filterTaps: true,
      },
    }
  );

  const disconnect = async () => {
    await resetStorageLastConnexion();
    disconnectSocket();
  };

  if (!connected) {
    return <Redirect to="/home"></Redirect>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle>Control</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={styles.controlArea} {...bind()}></div>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="danger" onClick={disconnect}>
            <IonIcon icon={logOutOutline} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={cogOutline} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={lockComputer}>
              <IonIcon icon={lockClosedOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Controls;
