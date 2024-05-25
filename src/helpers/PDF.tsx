import html2pdf from 'html2pdf.js';

interface PDFProps {
    elementId: string;
    fileName: string;
}
const handlePDF = ({elementId, fileName}: PDFProps) => {
    const element = document.getElementById(elementId);
    if (element) {
        html2pdf().from(element).set({
            margin: 1,
            filename: fileName, //`${data?.patientData?.FirstName}_${data?.patientData?.LastName}_${data?.createdAt}_VisitNote.pdf`,
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            html2canvas: { scale: 2 }
        }).save();
    }
};

export default handlePDF;


