import { User } from "@/models/UserModel";
import { firestore } from "@/lib/firebaseConn";

const ORDER_COLLECTION = "order";

export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string) {
    this.id = id;
    this.ref = firestore.collection(ORDER_COLLECTION).doc(id);
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

    return user ? user.data.email : null;
  }

  static async createNewOrder(newOrderData: any = {}) {
    const newOrderSnap = await firestore
      .collection(ORDER_COLLECTION)
      .add(newOrderData);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = newOrderData;
    return newOrder;
  }

  static async findById(orderId: string) {
    const orderSnap = await firestore
      .collection(ORDER_COLLECTION)
      .doc(orderId)
      .get();

    if (orderSnap.exists) {
      const myOrder = new Order(orderId);
      await myOrder.pullData();
      return myOrder;
    } else {
      throw new Error("La orden no existe");
    }
  }
}
