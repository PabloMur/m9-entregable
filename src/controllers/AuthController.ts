import { Auth } from "@/models/AuthModel";
import {
  emailSender,
  generateRandom5DigitNumber,
  generateExpirationDate,
} from "@/tools/emailSender";
import { NextRequest } from "next/server";

//resta hacer que se compruebe el vencimiento del code y si esta vencido que genere un code nuevos

export class AuthController {
  static async sendCode(request: NextRequest) {
    try {
      const { email } = await request.json();
      const userFounded = await Auth.findByEmail(email);

      if (userFounded == null) {
        const code = generateRandom5DigitNumber();
        const expiresAt = generateExpirationDate();
        await Auth.createAuth({
          email,
          code,
          expiresAt,
        });
        await emailSender(email, code);
        return { message: "Code sent to " + email };
      } else {
        await emailSender(email, userFounded.data.code);
        return { message: "Code sent to " + email };
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
