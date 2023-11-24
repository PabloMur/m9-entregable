import { Auth } from "@/models/AuthModel";
import { User } from "@/models/UserModel";
import { generateToken, isCodeExpired } from "@/tools/authTools";
import {
  emailSender,
  generateRandom5DigitNumber,
  generateExpirationDate,
} from "@/tools/emailSender";
import { NextRequest } from "next/server";
import yup from "yup";

export class AuthController {
  static async sendCode(request: NextRequest) {
    try {
      const schema = yup.object({
        email: yup.string().email().required(),
      });
      const { email } = await schema.validate(await request.json());
      let code = generateRandom5DigitNumber();
      const expiresAt = generateExpirationDate();

      const userFounded = await Auth.findByEmail(email);

      if (!userFounded) {
        await Promise.all([
          Auth.createAuth({ email, code, expiresAt }),
          User.createUser({ email }),
        ]);
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
      const schema = yup.object({
        email: yup.string().email().required(),
        code: yup.number().required(),
      });
      const { email, code } = await schema.validate(await request.json());
      const authFound = await Auth.findByEmailAndCode(email, code);

      if (authFound) {
        const { expiresAt } = authFound.data;

        if (isCodeExpired(expiresAt)) {
          const newCode = generateRandom5DigitNumber();
          const newExpirationDate = generateExpirationDate();

          await Auth.updateExpiration(newCode, newExpirationDate, email);
        }
        const newCode = generateRandom5DigitNumber();
        await Auth.updateCode(newCode, email);
        const token = generateToken(authFound);
        return { token };
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
