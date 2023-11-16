import { Auth } from "@/models/AuthModel";
import { emailSender } from "@/tools/emailSender";
import { NextRequest } from "next/server";

export class AuthController {
  static async sendCode(request: NextRequest) {
    try {
      const { email } = await request.json();
      const emailSent = await emailSender(email);
      return emailSent;
    } catch (error) {}
  }
}
