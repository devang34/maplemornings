// src/interfaces/Dish.ts
export interface Dish {
  id: number;
  name: string;
  image: string;
  info: string;
  meals: string;
  price: string;
  calorie: string;
}

export interface CartCreate {
  dishId: number;
  quantity: number;
}

export interface OrderCreate {
  items: CartCreate[];
  pincode: string;
  address: string;
}

export interface Order {
  id: number;
  createdAt: string;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  dish: Dish;
  address: string;
  pincode: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
}
