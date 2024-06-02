import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

interface EmailOptions {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: {
        filename: string;
        content: string;
        type: string;
        disposition: string;
    }[];
}

export const sendEmail = async (options:EmailOptions): Promise<void> => {
    const msg ={
        to: options.to,
        from: options.from,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
    }

    try {
        await sgMail.send(msg);
        console.log('Email sent succesfully')
    } catch (error) {
        throw new Error('Email could not be sent')
    }
    
}