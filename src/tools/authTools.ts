import jwt from "jsonwebtoken";

import { parseISO, isAfter } from "date-fns";

export function isValidToken(token: string, secret: string) {
  try {
    const decoded = jwt.verify(token, secret) as any;
    const expiresAt = parseISO(decoded.expiresAt);

    return isAfter(Date.now(), expiresAt);
  } catch (error) {
    return false;
  }
}
export function generateToken(data: any) {
  const secret = process.env.SECRET as any;
  const payload = {
    data,
    expiresIn: 86400 * 10, // 10 días
  };

  return jwt.sign(payload, secret, {
    // Algoritmo de firma
    header: {
      typ: "JWT",
      alg: "HS256",
    },
  });
}

export function ComparePasswords(passOne: string, passTwo: string) {
  return passOne == passTwo;
}

export function CreateToken() {}
