import './styles/huro/scss/main.scss';
import './styles/huro/vendor/css/icons.min.css'; // Adjust the path as needed
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

import { transcribeAudio } from "./helpers/transcribe";
import RecorderPage from './pages/Recorder';
import RecordingsTable from './pages/RecordingsTablePage';
import SummaryPage from './pages/EncounterSummary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorAuth from './pages/TwoFactorAuth';
import ProfileSettingsPage from './pages/ProfileSettings';
import IonicTabs from './pages/IonicTabs';
import { IonApp, IonContent, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


interface AudioData {
  source: 'recording' | 'upload';
  blob: Blob;
  transcription: string;
  summary: string;
}

const App: React.FC = () => {
  const [audioDataList, setAudioDataList] = useState<AudioData[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState("");

  const addAudioElement = async (source: 'recording' | 'upload', blob: Blob) => {
    try {
      const response = await transcribeAudio(blob);
      const transcription = response.text;
      setAudioDataList((prevList) => [
        ...prevList,
        { source, blob, transcription, summary: "" }
      ]);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleSummarySubmit = (transcription: string, summary: string) => {
    setAudioDataList((prevList) => {
      const updatedList = [...prevList];
      const index = updatedList.findIndex((audioData => audioData.transcription === transcription))
      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          summary,
        };
      }
      return updatedList;
    });
  };

  const handleTranscriptionClick = (transcription: string) => {
    setSelectedTranscription(transcription);
  }

  setupIonicReact();

  return (
      // <Router>
      //   <Switch>
      //     {/* <IonicTabs /> */}
          
      //     <Route path="/" exact component={Login} />
      //     <Route path="/authentication" component={TwoFactorAuth} />
      //     <Route path="/register" component={Register} />
      //     <Route path="/reset_password/:token" component={ResetPassword} />
      //     <Route path="/forgot-password" component={ForgotPassword} />
      //     <Route path="/home" component={Home} />
      //     <Route path="/profile_settings" component={ProfileSettingsPage} />
      //     <Route path="/recorder" render={(props) => (
      //       <RecorderPage
      //         {...props}
      //         onRecordingComplete={(blob) => addAudioElement('recording', blob)}
      //         onFileUpload={(file) => addAudioElement('upload', file)}
      //       />
      //     )} />
      //     <Route path="/table" render={(props) => (
      //       <RecordingsTable
      //         {...props}
      //         audioDataList={audioDataList}
      //         onTranscriptionClick={handleTranscriptionClick}
      //       />
      //     )} />
      //     <Route path="/summary/:gridID" render={(props) => (
      //       <SummaryPage />
      //     )} />
      //   </Switch>
      // </Router>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/authentication" component={TwoFactorAuth} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
