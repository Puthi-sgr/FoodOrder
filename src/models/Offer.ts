import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; //Vendor //Generic
  vendors: [any];
  title: string;
  description: string;
  minValue: number; //minimum order amount should be 10$
  offerAmount: number; //4$
  startValidity: Date;
  endValidity: Date;
  promoCode: string;
  promoType: string; //USER //ALL //BANK //CARD
  bank: [any];
  bins: [any];
  pinCode: string;
  isActive: boolean;
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "vendor",
      },
    ],
    title: { type: String, required: true },
    description: { type: String, required: true },
    minValue: { type: String, required: true },
    offerAmount: { type: String, required: true },
    startValidity: { type: Date, required: true },
    endValidity: { type: Date, required: true },
    promoCode: { type: String },
    promoType: { type: String },
    bank: [{ type: String, required: true }],
    bins: [{ type: String, required: true }],
    pinCode: { type: String, required: true },
    isActive: { type: Boolean, required: true },
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

const Offer = mongoose.model<OfferDoc>("offer", OfferSchema);

export { Offer };
