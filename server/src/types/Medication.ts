// src/types/Medication.ts
export interface Medication {
    patientId: string;
    fileId: string;
    drugCode?: string; // Made optional
    drugName: string;
    dosage?: string;
    frequency?: string;
    fillSupply?: number;
    methodOfIngestion?: string;
    startDate?: Date;
    endDate?: Date;
    specialInstructions?: string;
    status: boolean;
}
