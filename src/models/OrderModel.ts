import { User } from "@/models/UserModel";
import { firestore } from "@/lib/firebaseConn";

export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.ref = firestore.collection("order").doc(id);
  }

  async pullData() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async pushData() {
    await this.ref.update(this.data);
  }

  async findUserEmail() {
    const userId = this.data.userId;
    const user = await User.findByUserId(userId);
    return user.data.email;
  }

  static async createNewOrder(newOrderData: any = {}) {
    const newOrderSnap = await firestore.collection("order").add(newOrderData);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = newOrderData;
    return newOrder;
  }

  static async findById(orderId: string) {
    const orderSnap = await firestore.collection("order").doc(orderId).get();

    if (orderSnap.exists) {
      const myOrder = new Order(orderId);
      await myOrder.pullData();
      return myOrder;
    } else {
      throw new Error("La orden no existe");
    }
  }
}
