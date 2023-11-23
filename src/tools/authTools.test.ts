import test from "ava";
import {
  isCodeExpired,
  isValidToken,
  decodeToken,
  generateToken,
  ComparePasswords,
} from "./authTools";

test("isCodeExpired should return true for expired dates", (t) => {
  const expiredDate = new Date("2023-11-15");
  t.truthy(isCodeExpired(expiredDate));
});

test("isCodeExpired should return false for non-expired dates", (t) => {
  const nonExpiredDate = new Date();
  t.falsy(isCodeExpired(nonExpiredDate));
});

test("isValidToken should return true for valid tokens", (t) => {
  const token = generateToken({ userId: 123 });
  const secret = process.env.SECRET as string;

  t.truthy(isValidToken(token, secret));
});

test("isValidToken should return false for invalid tokens", (t) => {
  const invalidToken = "invalid_token";
  const secret = process.env.SECRET as string;

  t.falsy(isValidToken(invalidToken, secret));
});

test("decodeToken should return decoded token payload", (t) => {
  const token = generateToken({ userId: 123 });
  const decoded = decodeToken(token) as any;

  t.truthy(decoded);
  t.is(decoded.data.userId, 123);
});

test("decodeToken should return false for invalid tokens", (t) => {
  const invalidToken = "invalid_token";
  const decoded = decodeToken(invalidToken);

  t.falsy(decoded);
});

test("ComparePasswords should return true for matching passwords", (t) => {
  const passOne = "password123";
  const passTwo = "password123";

  t.truthy(ComparePasswords(passOne, passTwo));
});

test("ComparePasswords should return false for non-matching passwords", (t) => {
  const passOne = "password123";
  const passTwo = "incorrect_password";

  t.falsy(ComparePasswords(passOne, passTwo));
});
