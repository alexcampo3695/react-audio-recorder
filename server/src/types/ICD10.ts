export interface ICD10 {
    fileId: string;
    code: string;
    description: string;
    status: boolean;
    patientId: string;
    createdAt: Date;
    updatedAt: Date;
}