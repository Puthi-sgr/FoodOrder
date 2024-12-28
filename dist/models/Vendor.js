"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VendorSchema = new mongoose_1.Schema({
    name: { type: String, require: true },
    address: { type: String, require: true },
    pinCode: { type: String, require: true },
    foodType: [{ type: String }],
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    ownerName: { type: String, require: true },
    phone: { type: String, require: true, unique: true },
    salt: { type: String, require: true },
    serviceAvailability: { type: Boolean, require: true }, //available, busy, offline
    coverImages: [{ type: String }],
    rating: { type: Number, default: 0 },
    foods: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "food" }],
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password,
                delete ret.salt,
                delete ret.__V,
                delete ret.createdAt,
                delete ret.updateAt;
        },
    },
    timestamps: true,
});
const Vendor = mongoose_1.default.model("vendor", VendorSchema);
exports.Vendor = Vendor;
//# sourceMappingURL=Vendor.js.map