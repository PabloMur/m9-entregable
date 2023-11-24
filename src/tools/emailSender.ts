import sgMail from "@/lib/sendgridConn";
import { add } from "date-fns";

export function generateRandom5DigitNumber() {
  return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
}

export function generateExpirationDate() {
  return add(new Date(), { days: 20 });
}

export async function emailSender(email: string, code: number) {
  try {
    const message = {
      to: email,
      from: "votechoice.notifications@gmail.com",
      subject: "Codigo de verificacion",
      html: `
            <h3>Este es tu codigo de verificacion: <strong>${code}</strong></h3>
        `,
    };
    const emailSent = await sgMail.send(message);
    return { sent: emailSent };
  } catch (error) {
    console.error(error);
  }
}

export async function notificationsSender(message: any) {
  try {
    const emailSent = await sgMail.send(message);
    return { sent: emailSent };
  } catch (error) {
    console.error(error);
  }
}
