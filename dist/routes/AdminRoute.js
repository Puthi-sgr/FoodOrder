"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post("/vendor", index_1.CreateVendor);
router.get("/vendors", index_1.GetVendor);
router.get("/vendor/:id", index_1.GetVendorById);
//# sourceMappingURL=AdminRoute.js.map