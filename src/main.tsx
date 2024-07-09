import './styles/huro/scss/main.scss';
import './styles/huro/vendor/css/icons.min.css'; // Adjust the path as needed
import './styles/safe-area.css';
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './context/UserContext';


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
import PatientPage from './pages/PatientsPage';
import PatientProfile from './pages/PatientProfile';


interface AudioData {
  source: 'recording' | 'upload';
  blob: Blob;
}

const App: React.FC = () => {
  const [audioDataList, setAudioDataList] = useState<AudioData[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState("");

  const addAudioElement = async (source: 'recording' | 'upload', blob: Blob) => {
    try {
      setAudioDataList((prevList) => [
        ...prevList,
        { source, blob }
      ]);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const handleTranscriptionClick = (transcription: string) => {
    setSelectedTranscription(transcription);
  }

  // setupIonicReact();

  return (
    <div className="safe-area-top">
      <Router>
        <Switch>
          {/* <IonicTabs /> */}
          <Route path="/" exact component={Login} />
          <Route path="/authentication" component={TwoFactorAuth} />
          <Route path="/register" component={Register} />
          <Route path="/reset_password/:token" component={ResetPassword} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/home" component={Home} />
          <Route path="/profile_settings" component={ProfileSettingsPage} />
          <Route path="/patients" component={PatientPage} />
          <Route path="/recorder" render={(props) => (
            <RecorderPage
              {...props}
              onRecordingComplete={(blob) => addAudioElement('recording', blob)}
              onFileUpload={(file) => addAudioElement('upload', file)}
            />
          )} />
          <Route path="/table" render={(props) => (
            <RecordingsTable
              {...props}
              audioDataList={audioDataList}
              onTranscriptionClick={handleTranscriptionClick}
            />
          )} />
          <Route path="/summary/:gridID" render={(props) => (
            <SummaryPage />
          )} />
          <Route path="/patient_profile/:patientId" component={PatientProfile} />
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
