import { firestore } from "@/lib/firebaseConn";
import { isAfter } from "date-fns";

const collection = firestore.collection("auth");
export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id: string) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pullData() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async pushData() {
    this.ref.update(this.data);
  }

  isCodeexpired() {
    const now = new Date();
    const expires = this.data.expires.toDate();
    return isAfter(now, expires);
  }

  static async findByEmail(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const results = await collection.where("email", "==", cleanEmail).get();

    if (results.docs.length) {
      const founded = results.docs[0];
      const newAuth = new Auth(founded.id);
      newAuth.data = founded.data();
      return newAuth;
    } else {
      return null;
    }
  }

  static async createAuth(data: any) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;

    return newAuth;
  }

  static async findByUserId(userId: string) {
    const results = await collection.where("userId", "==", userId).get();

    if (results.docs.length) {
      const founded = results.docs[0];
      const newAuth = new Auth(founded.id);
      newAuth.data = founded.data();
      return newAuth;
    } else {
      return null;
    }
  }

  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const result = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (result.empty) {
      throw "Codigo o email incorrecto";
    } else {
      const auth = new Auth(result.docs[0].id);
      auth.data = result.docs[0].data();
      return auth;
    }
  }

  static async updateAuthEmail(userId: string, email: string) {
    const result = await collection.where("userId", "==", userId).get();

    if (result.empty) {
      console.error("Codigo incorrecto");
    } else {
      const auth = new Auth(result.docs[0].id);
      auth.data = result.docs[0].data();
      auth.data.email = email;
      await auth.pushData();
      return auth;
    }
  }
}
