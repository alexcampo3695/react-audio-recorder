import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';

interface Title {
  title: string;
}

const MobileHeader = (props:Title) => {
  return (
    <>
      <div style = {{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          marginTop: 'env(safe-area-inset-top)',
          zIndex: 1000, // Ensure the header is above other elements
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'white', // Ensure it has a background color
          padding: '15px 0', // Add padding for better spacing
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Optional: Add a subtle shadow for separation
        }}>
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