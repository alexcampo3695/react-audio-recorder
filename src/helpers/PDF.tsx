import html2pdf from 'html2pdf.js';

interface PDFProps {
    elementId: string;
    fileName: string;
}

export const handlePDF = ({ elementId, fileName }: PDFProps) => {
    const element = document.getElementById(elementId);
    if (element) {
        html2pdf().from(element).set({
            margin: 1,
            filename: fileName,
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            html2canvas: { scale: 2 }
        }).save();
    }
};

export const handlePDFtoEmail = ({ elementId, fileName }: { elementId: string, fileName: string }): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const element = document.getElementById(elementId);
        if (!element) {
            reject(new Error('Element not found'));
            return;
        }

        const options = {
            margin: 1,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf()
            .from(element)
            .set(options)
            .outputPdf('blob')
            .then((blob: Blob) => {
                resolve(blob);
            })
            .catch(reject);
    });
};
