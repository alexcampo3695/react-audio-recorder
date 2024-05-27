import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";

interface PatientDetailsProps {
  patientData: {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
  };
}

const ProfileSettingsPage = () => {
  return (
    <AppWrapper
        children={<ProfileSettings />}
        title='Settings'
      />
  )
    
};

export default ProfileSettingsPage;
