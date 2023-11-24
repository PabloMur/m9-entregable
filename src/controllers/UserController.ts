// controllers/userController.js
import { User } from "@/models/UserModel";
import { NextRequest } from "next/server";
import { OrderController } from "./OrderController";
import yup from "yup";

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
      const schema = yup.object({
        email: yup.string().email().required(),
      });
      const { email } = await schema.validate(
        request.headers.get("user-email")
      );
      const user = await User.findByUserEmail(email);

      if (user) {
        const userOrders = await OrderController.getUserOrders(user.id);
        return { orders: userOrders, userId: user.id };
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
      const schema = yup.object({
        email: yup.string().email().required(),
      });

      const bodySchema = yup.object({
        field: yup.string().required(),
        value: yup.string().required(),
      });

      const { email } = await schema.validate(
        request.headers.get("user-email")
      );

      const { field, value } = await bodySchema.validate(await request.json());

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
      const schema = yup.object({
        email: yup.string().email().required(),
      });

      const { email } = await schema.validate(
        request.headers.get("user-email")
      );

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
      const schema = yup.object({
        userId: yup.string().required(),
        product: yup.object().required(),
      });
      const { userId, product } = await schema.validate(await request.json());
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
