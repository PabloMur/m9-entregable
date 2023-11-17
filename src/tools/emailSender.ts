import sgMail from "@/lib/sendgridConn";
import { add, format } from "date-fns";

export function generateRandom5DigitNumber() {
  // Generate a random number between 10000 and 99999
  const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  return randomNum;
}

export function generateExpirationDate() {
  const currentDate = new Date();
  const futureDate = add(currentDate, { days: 20 });
  const formatedDate = format(futureDate, "dd/MM/yyyy");
  return formatedDate;
}

export async function emailSender(email: string, code: number) {
  try {
    const message = {
      to: email,
      from: "votechoice.notifications@gmail.com",
      subject: "Codigo de verificacion",
      html: `
            <h3>Este es tu codigo de verificacion: ${code}</h3>
            
        `,
    };
    const emailSent = await sgMail.send(message);
    return { sent: emailSent };
  } catch (error) {
    console.error(error);
  }
}
