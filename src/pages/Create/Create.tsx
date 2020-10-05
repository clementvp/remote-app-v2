import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonInput,
  IonLabel,
  IonItem,
  IonList,
  IonButton,
} from "@ionic/react";
import React, { useContext, useState } from "react";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import shortId from "shortid";

import styles from "./Create.module.scss";

import { RouteComponentProps } from "react-router";
import { ServerContext } from "../../components/contexts/ServersContext";

const Create: React.FC<RouteComponentProps> = ({ history }) => {
  const [serverName, setServerName] = useState("");
  const [address, setAddress] = useState("");

  const { createServer } = useContext(ServerContext);

  const validate = async () => {
    if (address !== "" && serverName !== "") {
      const formatedAddress = address.replace("http://", "");
      const serverid = shortId.generate();
      setServerName("");
      setAddress("");
      if (createServer) {
        await createServer(serverid, serverName, formatedAddress);
        history.push("/home");
      }
    }
  };

  const scan = async () => {
    const data = await BarcodeScanner.scan();
    const splitted = data.text.split("////");
    setServerName(splitted[0]);
    setAddress(splitted[1]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className={styles.buttonsTitle}>Add a server</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={styles.formContainer}>
          <IonList className={styles.lineInput}>
            <div className={styles.btnContainer}>
              <IonButton onClick={scan}>Scan server qr Code</IonButton>
            </div>
            <div className={styles.btnContainer}>
              <h4>Or fill the fields manually</h4>
            </div>
            <IonLabel position="stacked">Server Name:</IonLabel>
            <IonItem lines="none">
              <IonInput
                onIonChange={(e) => setServerName(e.detail.value!)}
                type="text"
                value={serverName}
              />
            </IonItem>
            <IonLabel position="stacked">Server Address:</IonLabel>
            <IonItem lines="none">
              <IonInput
                onIonChange={(e) => setAddress(e.detail.value!)}
                type="text"
                value={address}
              />
            </IonItem>
          </IonList>
          <div className={styles.btnContainer}>
            <IonButton onClick={validate}>Validate</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Create;
