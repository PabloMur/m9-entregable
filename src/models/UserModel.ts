import { firestore } from "@/lib/firebaseConn";

const collection = firestore.collection("users");

export class User {
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

  static async getCart(userId: string) {
    try {
      const findUser = await collection.doc(userId).get();
      if (findUser.exists) {
        const user = new User(findUser.id);
        await user.pullData();
        return user.data.cart;
      } else {
        console.error("El usuario no existe");
        throw new Error("El usuario no existe");
      }
    } catch (err) {
      console.error("Falló el getCart en user model:", err);
      throw new Error("Falló el getCart en user model");
    }
  }

  static async addToCart(userId: string, product: object) {
    try {
      const findUser = await collection.doc(userId).get();
      if (findUser.exists) {
        const user = new User(findUser.id);
        await user.pullData();
        user.data.cart.push(product);
        await user.pushData();
        return user.data.cart;
      } else {
        console.error("El usuario no existe");
        throw new Error("El usuario no existe");
      }
    } catch (err) {
      console.error("Falló el addToCart en user model:", err);
      throw new Error("Falló el addToCart en user model");
    }
  }

  static async deleteFromCart(userId: string, product: any) {
    try {
      const findUser = await collection.doc(userId).get();
      if (findUser.exists) {
        const user = new User(findUser.id);
        await user.pullData();
        const cart = user.data.cart;

        const productToDelete = cart.find(
          (prod: any) => prod.id === product.id
        );

        if (productToDelete) {
          const newCart = cart.filter(
            (prod: any) => prod.id !== productToDelete.id
          );
          user.data.cart = newCart;
          await user.pushData();
          return newCart;
        } else {
          console.error("El producto no está en el carrito");
          throw new Error("El producto no está en el carrito");
        }
      } else {
        console.error("El usuario no existe");
        throw new Error("El usuario no existe");
      }
    } catch (err) {
      console.error("Falló el deleteFromCart en user model:", err);
      throw new Error("Falló el deleteFromCart en user model");
    }
  }

  static async createUser(data: any) {
    try {
      const newUserSnap = await collection.add(data);
      const newUser = new User(newUserSnap.id);
      newUser.data = data;
      return newUser;
    } catch (err) {
      console.error("Falló al crear usuario:", err);
      throw new Error("Falló al crear usuario");
    }
  }

  static async findByUserId(userId: string) {
    try {
      const user = await collection.doc(userId).get();
      if (user.exists) {
        const myUser = new User(user.id);
        myUser.data = user.data();
        return myUser;
      } else {
        console.error("El userId no existe");
        throw new Error("El userId no existe");
      }
    } catch (err) {
      console.error("Falló al buscar usuario por ID:", err);
      throw new Error("Falló al buscar usuario por ID");
    }
  }

  static async findByUserEmail(email: string) {
    try {
      const result = await collection.where("email", "==", email).get();

      if (!result.empty) {
        const userDoc = result.docs[0];
        const myUser = new User(userDoc.id);
        myUser.data = userDoc.data();
        return myUser;
      } else {
        console.error("Usuario no encontrado");
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Falló al buscar usuario por ID:", error);
      throw new Error("Falló al buscar usuario por ID");
    }
  }

  static async updateUserField(userId: string, field: string, value: any) {
    try {
      const results = await collection.doc(userId).get();
      if (results.exists) {
        const user = new User(results.id);
        user.data = results.data();
        user.data[field] = value;
        await user.pushData();
        return user.data;
      } else {
        console.error("El usuario no existe");
        throw new Error("El usuario no existe");
      }
    } catch (err) {
      console.error("Falló al actualizar usuario:", err);
      throw new Error("Falló al actualizar usuario");
    }
  }

  static async updateEmail(userId: string, email: string) {
    return this.updateUserField(userId, "email", email);
  }

  static async updateUsername(userId: string, username: string) {
    return this.updateUserField(userId, "username", username);
  }

  static async updateAge(userId: string, age: number) {
    return this.updateUserField(userId, "age", age);
  }
}
