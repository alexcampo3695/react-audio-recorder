import { Request, Response } from 'express'
import { sendEmail } from '../services/emailService';
import User from '../models/Users'
import { format } from 'date-fns';

interface EmailOptions {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: string;
      type: string;
      disposition: string;
    }>;
  }

export const sendPdfEmail = async (req: Request, res: Response) => {
    const { userId, fileName, patientName, visitDate } = req.body
    const pdfBuffer = req.file?.buffer;

    if (!userId || !pdfBuffer || !fileName || !patientName || !visitDate) {
        return res.status(400).json({message: 'UserId and a file are required'})
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({message : 'User not found'})
        }

        const formattedDate = format(new Date(visitDate || ''), 'MM-dd-yyyy')

        const emailOptions = {
            to: user.email,
            from: process.env.SENDGRID_FROM,
            subject: `${patientName}'s Visit Note`,
            text: `Please find the visit note for ${patientName} on ${formattedDate} attached.`,
            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer.toString('base64'),
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ]
        };
        await sendEmail(emailOptions as EmailOptions)

        res.status(200).json({message: 'Email sent successfully'})
    } catch (error) {
        console.error('Error sending email', error)
        res.status(500).json({message: 'Email could not be sent'})
    }
}

