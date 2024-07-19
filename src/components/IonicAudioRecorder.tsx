import React, { useState, useEffect } from "react";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { useUser } from "../context/UserContext";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import antidoteEmblem from "../styles/assets/Antidote_Emblem.svg";
import { API_BASE_URL } from "../config";
import { isPlatform } from "@ionic/react";
import Modal from "./Modal";
import ProductService from "./PurchaseHistory";
// import ProductServiceAlt from "./ProductServiceAlt";
import SubscriptionOverview from "../react-native/SubscriptionOverview";
// import { Permissions } from '@capacitor/core';
import { useLocation, useHistory } from "react-router-dom";

interface PaymentSchema {
  userId: string;
  subscriberId: string;
  productId: string;
  original_transaction_id: string;
  purchaseDate: Date;
  price: number;
  priceUsd: number;
  currency_code: string;
  country_code: string;
  store: string;
  environment: string;
  isSubscriptionActive: boolean;
  expireDate: Date;
  eventType: number;
  eventId: string;
  eventDate: Date;
  source: string;
  vendorId: string;
  appId: string;
  customId?: string;
  device?: string;
  systemVersion?: string;
  receiptValidated: boolean;
  appleReceiptValidated: boolean;
  glassfyValidated: boolean;
}


interface IonicAudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  isRecording: boolean;
}

const IonicAudioRecorder: React.FC<IonicAudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStateChange,
  isRecording,
}) => {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
  const { user } = useUser();
  const notyf = new Notyf();
  const [paymentData, setPaymentData] = useState<PaymentSchema[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const history = useHistory();

  const fetchUserPayment = async () => {

    if (!user?.id) {
      console.error('User ID is not available');
      return;
    }
    console.log('Fetch user payment userId:', user?.id);
    
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
    if (user?.id) {
      fetchUserPayment();
    } else {
      console.log('No user ID available, skipping payment fetch');
    }
  }, [user?.id]);

  useEffect(() => {
    if (onRecordingStateChange) {
      onRecordingStateChange(recordingState === "recording");
    }
  }, [recordingState, onRecordingStateChange]);

  const checkPaymentStatus = (paymentData: PaymentSchema[] | null | undefined) => {
    if (!Array.isArray(paymentData) || paymentData.length === 0) {
      notyf.error('You do not have an active subscription');
      setPaymentModalOpen(true);
      return false;
    }

    const userPayments = paymentData.filter(payment => payment.userId === user?.id);

    if (userPayments.length === 0) {
      notyf.error('No payment data found. Please subscribe on IOS App.');
      setPaymentModalOpen(true);
      return false;
    }

    const validSubscriptions = userPayments.some(payment => 
      (payment.productId === "care_voice_subscription_monthly_99.99" || 
      payment.productId === "care_voice_subscription_annual_899.99") 
      && payment.isSubscriptionActive === true
    );

    if (!validSubscriptions) {
      notyf.error("No active subscription found. Please subscribe on IOS App.");
      setPaymentModalOpen(true);
      return false;
    }

    return true;
  }


  function base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notyf.error('getUserMedia API is not supported in this browser.');
      return;
    }

    if ((checkPaymentStatus(paymentData) === false)) {
      return;
    };
  
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
      if (!hasPermission.value) {
        notyf.error('Audio recording permission not granted.')
        return
      }
      await VoiceRecorder.startRecording();
      setRecordingState("recording");
    } catch (error) {
      console.error('Failed to start recording:', error);
      notyf.error('Failed to start recording');
      setRecordingState("idle");
    }
  };

  const stopRecording = async (save: boolean = true) => {
    try {
      const status = await VoiceRecorder.getCurrentStatus();
      if (status.status !== 'RECORDING') {
        notyf.error('Recording has not yet started.')
        setRecordingState("idle");
        return
      }

      const result = await VoiceRecorder.stopRecording();
      setRecordingState("idle");
      if (result.value && save) {
        const audioBlob = base64ToBlob(result.value.recordDataBase64, result.value.mimeType);
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        // setRecordingState('idle')
        notyf.success('Recording saved successfully');
      } else if (!save) {
        notyf.error('Recording Discarded');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      notyf.error('Failed to stop recording');
      setRecordingState("idle");
    }
  }

  const toggleRecording = () => {
    if (checkPaymentStatus(paymentData) === true) {
      if (recordingState === "idle") {
        startRecording();
      } else if (recordingState === "recording") {
        stopRecording();
      }
    } else {
      history.push('/subscriptions');
    }
  }

  return (
    <>
      <div className="antidote-recorder-container" data-testid="audio_recorder">
        <div>
          <div 
            className="antidote-recorder-container"
          >
            <div 
              className={`antidote-recorder-button ${recordingState !== "idle" ? "is-recording" : ""} ${recordingState === "paused" ? "is-paused" : ""} ${isPlatform('ios')? "antidote-recorder-button-mobile" : "antidote-recorder-button"}`} 
              onClick={toggleRecording}
              style={{marginTop: isPlatform('ios') ? '-100px' : ''}}
            >
              <img className="light-image recorder-emblem" src={antidoteEmblem} alt="" />
              <img className="dark-image recorder-emblem" src={antidoteEmblem} alt="" />
            </div>
            <div className="timer-container">
              {/* <div className="title-wrap">
                <h1 className="title is-4">{formatTime(recordingTime)}</h1>
              </div> */}
            </div>
          </div>
          <div 
            className="antidote-controls-container"
          >
            <button 
              className="button is-success-light is-circle is-elevated complete"
              onClick={recordingState === 'recording' ? () => stopRecording() : startRecording} data-testid="ar_mic" title={recordingState === 'recording' ? "Save recording" : "Start recording"}
              style={{marginTop: isPlatform('ios') ? '-80px' : ''}}
            >
              <span className="icon is-small">
                <i 
                  aria-hidden="true" 
                  className="fas fa-check"
                  style={{fontSize: isPlatform('ios') ? '1rem' : '1.5rem'}}
                >
                </i>
              </span>
            </button>


            <button 
              className="button is-danger-light is-circle is-elevated complete"
              onClick={() => stopRecording(false)} title="Discard Recording" data-testid="ar_cancel"
              style={{marginTop: isPlatform('ios') ? '-80px' : ''}}
            >
              <span className="icon is-small">
                <i 
                  aria-hidden="true" 
                  className="fas fa-trash-alt"
                  style={{fontSize: isPlatform('ios') ? '1rem' : '1.5rem', color: '#e62965'}}
                >
                </i>
              </span>
            </button>
            
            {/* <div className={"deleted"} onClick={() => stopRecording(false)} title="Discard Recording" data-testid="ar_cancel">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </i>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default IonicAudioRecorder;


