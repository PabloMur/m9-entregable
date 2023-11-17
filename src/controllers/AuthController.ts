import { Auth } from "@/models/AuthModel";
import { User } from "@/models/UserModel";
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

      let code = generateRandom5DigitNumber();
      const expiresAt = generateExpirationDate();

      if (!userFounded) {
        await Auth.createAuth({
          email,
          code,
          expiresAt,
        });
        await User.createUser({
          email,
        });
      } else {
        code = userFounded.data.code;
      }

      await emailSender(email, code);
      return { message: "Code sent to " + email };
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  static async generateToken(request: NextRequest) {
    try {
      const { email, code } = await request.json();
      const authFound = await Auth.findByEmailAndCode(email, code);

      if (authFound) {
        const { expiresAt } = authFound.data;
        const isExpired = isCodeExpired(expiresAt);

        if (isExpired) {
          const newCode = generateRandom5DigitNumber();
          const newExpirationDate = generateExpirationDate();

          await Auth.updateExpiration(newCode, newExpirationDate, email);
        }

        const token = generateToken(authFound);
        return { token };
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
