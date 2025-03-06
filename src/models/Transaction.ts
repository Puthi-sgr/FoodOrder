import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  vendorId: string;
  customer: string;
  orderId: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

const TransactionSchema = new Schema(
  {
    vendorId: { type: String },
    customer: { type: String },
    orderId: { type: String },
    orderValue: { type: String },
    offerUsed: { type: String },
    status: { type: String },
    paymentMode: { type: String },
    paymentResponse: { type: String },
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

const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  TransactionSchema
);

export { Transaction };
