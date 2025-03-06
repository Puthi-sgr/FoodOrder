import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string;
  customerID: Schema.Types.ObjectId;
  customerName: string;
  vendorID: Schema.Types.ObjectId;
  vendorName: string;
  items: [any]; //{food, unit}
  totalAmount: number;
  paidAmount: number;
  date: Date;
  paidThrough: string; //cod , credit card, Wallet
  paymentResponse: string; //{status: true, response: some bank response}
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  readyTime: number; //max 60mins
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: false },
    customerID: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    customerName: { type: String, required: false },
    vendorID: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    vendorName: {
      type: String,
    },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true }, //items.food
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: false },
    paidAmount: { type: Number, required: false },
    date: { type: Date, required: false },
    paidThrough: { type: String, required: false },
    paymentResponse: { type: String, required: false },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: String },
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
