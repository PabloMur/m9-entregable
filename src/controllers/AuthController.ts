import { Auth } from "@/models/AuthModel";
import { generateToken, isCodeExpired } from "@/tools/authTools";
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

      if (!userFounded) {
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

  static async generateToken(request: NextRequest) {
    try {
      const { email, code } = await request.json();
      const authFinded = await Auth.findByEmailAndCode(email, code);
      if (authFinded) {
        const expires = authFinded.data.expiresAt;
        const isExpired = isCodeExpired(expires);
        if (!isExpired) {
          const token = generateToken(authFinded);
          return { token };
        } else {
          console.log("esto esta por pasar");

          //se debe hacer que auth actualice el codigo
          const newCode = generateRandom5DigitNumber();
          const newExpirationDate = generateExpirationDate();
          const updatedAuth = await Auth.updateExpiration(
            newCode,
            newExpirationDate,
            email
          );
          const token = generateToken(updatedAuth);
          return { token };
        }
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
