import sgMail from "@/lib/sendgridConn";

function generateRandom5DigitNumber() {
  // Generate a random number between 10000 and 99999
  const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  return randomNum;
}

export async function emailSender(email: string) {
  try {
    const code = generateRandom5DigitNumber();
    const message = {
      to: email,
      from: "votechoice.notifications@gmail.com",
      subject: "Codigo de verificacion",
      html: `
            <h3>Este es tu codigo de verificacion: ${code}</h3>
            
        `,
    };
    const emailSent = await sgMail.send(message);
    return { sent: emailSent, code };
  } catch (error) {
    console.error(error);
  }
}
