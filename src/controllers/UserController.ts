// controllers/userController.js
import { User } from "@/models/UserModel";
import { NextRequest } from "next/server";

export class UserController {
  static async getUser(email: string) {
    try {
      const user = await User.findByUserEmail(email);

      if (user) {
        return { user: user.data };
      } else {
        return { message: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }

  static async getMeOrders(request: NextRequest) {
    try {
      const email = request.headers.get("user-email") as string;
      const user = await User.findByUserEmail(email);

      if (user) {
        return { orders: user.data.orders };
      } else {
        return { message: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }

  static async updateUser(request: NextRequest) {
    try {
      const email = request.headers.get("user-email") as any;
      const { field, value } = await request.json();
      const updatedUser = await User.updateUserField(email, field, value);

      if (updatedUser) {
        return { message: "User updated successfully", user: updatedUser };
      } else {
        return { message: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }

  static async updateUserAddress(request: NextRequest) {
    try {
      const email = request.headers.get("user-email") as any;
      const { newAddress } = await request.json();
      const updatedUser = await User.updateUserField(
        email,
        "address",
        newAddress
      );

      if (updatedUser) {
        return { message: "User updated successfully", user: updatedUser };
      } else {
        return { message: "User not found" };
      }
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }

  static async addToCart(request: NextRequest) {
    try {
      const { userId, product } = await request.json();
      const updatedCart = await User.addToCart(userId, product);

      return { message: "Product added to cart", cart: updatedCart };
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }

  static async deleteFromCart(request: NextRequest) {
    try {
      const { userId, product } = await request.json();
      const updatedCart = await User.deleteFromCart(userId, product);

      return { message: "Product deleted from cart", cart: updatedCart };
    } catch (error) {
      console.error(error);
      return { error: "Internal server error" };
    }
  }
}
