import mongoose, { Schema, Document, Model } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  address: string;
  pinCode: string;
  foodType: [string];
  email: string;
  password: string;
  ownerName: string;
  phone: string;
  salt: string;
  serviceAwaitable: boolean; //available, busy, offline
  coverImages: [string];
  rating: number;
  food: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, require: true },
    address: { type: String, require: true },
    pinCode: { type: String, require: true },
    foodType: [{ type: String }],
    email: { type: String, require: true },
    password: { type: String, require: true },
    ownerName: { type: String, require: true },
    phone: { type: String, require: true },
    salt: { type: String, require: true },
    serviceAwaitable: { type: Boolean, require: true }, //available, busy, offline
    coverImages: [{ type: String }],
    rating: { type: Number, default: 0 },
    food: [{ type: Schema.Types.ObjectId, ref: "food" }],
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("vendor", VendorSchema);
export { Vendor };
