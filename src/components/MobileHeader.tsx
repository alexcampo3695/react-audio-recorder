import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import "../styles/MobileHeader.css";

interface Title {
  title: string;
}

const MobileHeader = (props:Title) => {
  return (
    <>
      <div
        className={"mobile-header"}
      >
        <h4
          className={"dark-inverted"}
          style={{
            marginTop: "40px",
            marginBottom: "0px"
          }}  
        >
          {props.title}
        </h4>
      </div>
    </>
  );
}

export default MobileHeader;