import React, { useState, useMemo, useCallback, useEffect } from "react"; 
import AudioRecorder from "../components/AudioRecordingComponent";
import { Link, useLocation, useHistory } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import "../styles/recorder-button.scss";
import AudioUploader from "../components/AudioUploader";
import { useUser } from "../context/UserContext";
import IonicAudioRecorder from "../components/IonicAudioRecorder";
import { API_BASE_URL } from "../config";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface RecorderPageProps {
  onRecordingComplete: (blob: Blob) => void;
  onFileUpload: (file: File) => void;
}

interface PaymentSchema {
  subscriberId: String,
  productId: String,
  eventType: Number,
  store: String,
  originalTransactionId: String,
  purchaseDateMs: Number,
  price: Number,
  currencyCode: String,
  expireDate: Number,
  isSubscriptionActive: Boolean,
  environment: String,
  eventId: String,
  eventDate: Number,
  source: String,
  vendorId: String,
  appId: String,
  originalPurchaseDateMs: Number,
  priceUsd: Number,
  countryCode: String,
  duration: Number,
  customId: String,
  device: String,
  systemVersion: String,
  permissionId: String,
  isValid: Boolean,
  receiptValidated: Boolean,
}

interface PatientData {
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  // Add other fields as necessary
}

interface LocationState {
  patientData?: PatientData;
}

const RecorderPage: React.FC<RecorderPageProps> = ({
  onRecordingComplete,
  onFileUpload,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('record');
  const [paymentData, setPaymentData] = useState<PaymentSchema[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const notyf = new Notyf();


  const patientData = useMemo(() => {
    const state = location.state as LocationState;
    console.log('Derived state:', state);
    return state?.patientData ?? null;
  }, [location.state]);  // Dependency on location.state

  const [isRecording, setIsRecording] = useState(false);
  const { user } = useUser();

  const hasActiveSubscription = (paymentData: PaymentSchema[] | null ): boolean => {
    if (!paymentData || paymentData.length === 0) {
      return false;
    }

    return paymentData.some(payment => 
      payment.isSubscriptionActive === true &&
      (payment.productId === "care_voice_subscription_monthly_99.99" || "care_voice_subscription_monthly_99.99")
    )
  }

  const handleRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecording(isRecording);
  }, []);

  async function handleRecordingComplete(blob: Blob) {
    const formData = new FormData();
    formData.append("recording", blob, "recording.webm");
    
    if (patientData) {
      formData.append("patientData", JSON.stringify(patientData));  // Correct the key here
    } else {
      console.error("No patient data found");
    }

    if (user) {
      formData.append("userId", user.id);
    } else {
      console.error("No user data found");
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/audio/upload`, {
        method: "POST",
        body: formData,
      });
      console.log('formData', formData)
      if (response.ok) {
        const data = await response.json();
        onRecordingComplete(blob);
        setIsRecording(false);
        history.push('/table');
      } else {
        console.error("Error uploading recording: Server responded with status", response.status);
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
    }
  }
  
  
    
  const handleTabClick = (tab: string, event:React.MouseEvent) => {
    event.preventDefault()
    if (tab === 'upload') {
      if (hasActiveSubscription(paymentData)) {
        setActiveTab(tab)
      } else {
        notyf.error('You do not have an active subscription');
      }
    } else {
      setActiveTab(tab)
    }
  }

  const fetchUserPayment = async () => {
    const url = `${API_BASE_URL}/api/payment/${user?.id}`;
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch user payment: ${response.status}`);
      }
      const paymentData: PaymentSchema[] = await response.json();
      setPaymentData(paymentData);
    } catch (e) {
      console.error('Failed to fetch user payment:', e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log('Current user ID:', user?.id);
    if (user?.id) {
      fetchUserPayment();
    } else {
      console.log('No user ID available, skipping payment fetch');
    }
  }, [user?.id]);

  return (
    <AppWrapper
      title="Recorder"
      children={
        <>
          <div className="tabs-wrapper is-slider is-squared" style={{display: 'flex', justifyContent: 'center'}}>
            <div className="tabs-inner">
                <div className="tabs">
                  <ul>
                    <li 
                      data-tab="team-tab1" 
                      className={activeTab === 'record' ? 'is-active' : ''}
                      onClick={(e) => handleTabClick('record', e)}
                    >
                      <a>
                        <span>Recorder</span>
                      </a>
                    </li>
                    <li 
                      data-tab="projects-tab1"
                      className={activeTab === 'upload' ? 'is-active': ''}
                      onClick={(e) => handleTabClick('upload', e)}
                    >
                      <a>
                        <span>Upload</span>
                      </a>
                    </li>
                    <li className="tab-naver"></li>
                  </ul>
                </div>
            </div>
          </div>
          <div>
            {activeTab === 'record' ? (
              <IonicAudioRecorder 
                onRecordingComplete={handleRecordingComplete}
                onRecordingStateChange={handleRecordingStateChange}
                isRecording={isRecording}
              />
            ) : (
              
              <AudioUploader onFileUpload={onFileUpload} />
              
            )}
            {/* { patientData && <PatientDetails patientData={patientData} />} */}
          </div>
        </>
      }
    />
  );
};

export default RecorderPage;
