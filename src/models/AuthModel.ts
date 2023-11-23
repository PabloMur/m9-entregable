import { firestore } from "@/lib/firebaseConn";

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
    await this.ref.update(this.data);
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
      return null; // Devolver null en lugar de false cuando no se encuentra la autenticación
    }
  }

  static async createAuth(data: any) {
    try {
      const newAuthSnap = await collection.add(data);
      const newAuth = new Auth(newAuthSnap.id);
      newAuth.data = data;
      return newAuth;
    } catch (error) {
      console.error("Falló al crear autenticación:", error);
      throw new Error("Falló al crear autenticación");
    }
  }

  static async findByUserId(userId: string) {
    try {
      const results = await collection.where("userId", "==", userId).get();

      if (results.docs.length) {
        const founded = results.docs[0];
        const newAuth = new Auth(founded.id);
        newAuth.data = founded.data();
        return newAuth;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Falló al buscar autenticación por userId:", error);
      throw new Error("Falló al buscar autenticación por userId");
    }
  }

  static async findByEmailAndCode(email: string, code: number) {
    try {
      const cleanEmail = email.trim().toLocaleLowerCase();
      const result = await collection
        .where("email", "==", cleanEmail)
        .where("code", "==", code)
        .get();

      if (result.docs.length) {
        const auth = new Auth(result.docs[0].id);
        auth.data = result.docs[0].data();
        return auth;
      } else {
        throw new Error("Código o email incorrecto");
      }
    } catch (error) {
      console.error("Falló al buscar autenticación por email y código:", error);
      throw new Error("Falló al buscar autenticación por email y código");
    }
  }

  static async updateAuthEmail(userId: string, email: string) {
    try {
      const results = await collection.where("userId", "==", userId).get();

      if (results.docs.length) {
        const auth = new Auth(results.docs[0].id);
        auth.data = results.docs[0].data();
        auth.data.email = email;
        await auth.pushData();
        return auth;
      } else {
        console.error("Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Falló al actualizar email de autenticación:", error);
      throw new Error("Falló al actualizar email de autenticación");
    }
  }

  static async updateExpiration(code: number, date: any, email: string) {
    try {
      const auth = await this.findByEmail(email);

      if (auth) {
        auth.data.code = code;
        auth.data.expiresAt = date;
        await auth.pushData();
        return auth;
      } else {
        console.error("Autenticación no encontrada");
        throw new Error("Autenticación no encontrada");
      }
    } catch (error) {
      console.error("Falló al actualizar fecha de expiración:", error);
      throw new Error("Falló al actualizar fecha de expiración");
    }
  }

  static async updateCode(code: number, email: string) {
    try {
      const auth = await this.findByEmail(email);

      if (auth) {
        auth.data.code = code;
        await auth.pushData();
        return auth;
      } else {
        console.error("Autenticación no encontrada");
        throw new Error("Autenticación no encontrada");
      }
    } catch (error) {
      console.error("Falló al actualizar fecha de expiración:", error);
      throw new Error("Falló al actualizar fecha de expiración");
    }
  }
}
