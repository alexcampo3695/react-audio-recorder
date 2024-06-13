// import React, { useState, useEffect } from "react";
// // import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
// // import { useUser } from '../context/UserContext';
// // import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
// // import { useNavigate } from "react-router-dom";
// // import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
// // import { IonReactRouter } from '@ionic/react-router';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { playCircle, radio, library, search } from 'ionicons/icons';
// // import Home from '../pages/Home';
// // import RecordingsTable from '../pages/RecordingsTablePage';
// // import { transcribeAudio } from "../helpers/transcribe";

// interface AudioData {
//     source: 'recording' | 'upload';
//     blob: Blob;
//     transcription: string;
//     summary: string;
//   }
  
// const NavBar = () => {
//     const [audioDataList, setAudioDataList] = useState<AudioData[]>([]);
//     const [selectedTranscription, setSelectedTranscription] = useState("");
//     const addAudioElement = async (source: 'recording' | 'upload' , blob: Blob) => {
//         try { 
//             const response = await transcribeAudio(blob);
//             const transcription = response.text;
//             setAudioDataList((prevList) => [
//             ...prevList, 
//             { source, blob, transcription, summary: "" }
//             ]);
//         } catch (error) {
//             console.error("Error transcribing audio:", error);
//         }
//         };

//     const handleSummarySubmit = (transcription: string, summary: string) => {
//         setAudioDataList((prevList) => {
//             const updatedList = [...prevList];
//             const index = updatedList.findIndex((audioData => audioData.transcription === transcription))
//             if (index !== -1) {
//             updatedList[index] = {
//                 ...updatedList[index],
//                 summary,
//             };
//             }
//             return updatedList;
//         });
//     };

//     const handleTranscriptionClick = (transcription:string) => {
//         setSelectedTranscription(transcription);
//     }

//     <IonReactRouter>
//       <IonTabs>
//         <IonRouterOutlet>
//           <Routes>
//             <Route path="/" element={<Navigate to="/home" />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/table" element={<RecordingsTable audioDataList={audioDataList} onTranscriptionClick={handleTranscriptionClick} />} />
//             {/* Add other routes as necessary */}
//           </Routes>
//         </IonRouterOutlet>

//         <IonTabBar slot="bottom">
//           <IonTabButton tab="home" href="/home">
//             <IonIcon icon={playCircle} />
//             <IonLabel>Listen now</IonLabel>
//           </IonTabButton>
//           {/* Add other tab buttons as necessary */}
//         </IonTabBar>
//       </IonTabs>
//     </IonReactRouter>
// };

// export default NavBar;
