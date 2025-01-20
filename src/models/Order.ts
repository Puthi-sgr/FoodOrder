import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string;
  customerID: Schema.Types.ObjectId;
  customerName: string;
  items: [any]; //{food, unit}
  totalAmount: number;
  date: Date;
  paidThrough: string; //cod , credit card, Wallet
  paymentResponse: string; //{status: true, response: some bank response}
  orderStatus: string;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String },
    customerID: { type: Schema.Types.ObjectId, ref: "customer", required: true },
    customerName: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: false },
    date: { type: Date, required: false },
    paidThrough: { type: String, required: false },
    paymentResponse: { type: String, required: false },
    orderStatus: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._v, delete ret.createAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };
