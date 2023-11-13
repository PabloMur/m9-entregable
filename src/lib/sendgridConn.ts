import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID as any);

export default sgMail;
