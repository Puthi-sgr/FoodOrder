"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const CommonAuth_1 = require("../middlewares/CommonAuth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const imagePath = path_1.default.join(process.cwd(), "images");
        cb(null, imagePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random());
        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", index_1.VendorLogin);
router.get("/profile", CommonAuth_1.Authenticate, index_1.GetVendorProfile);
router.patch("/profile", CommonAuth_1.Authenticate, index_1.UpdateVendorProfile);
router.patch("/cover", CommonAuth_1.Authenticate, images, index_1.UpdateCoverImages);
router.patch("/service", CommonAuth_1.Authenticate, index_1.UpdateVendorService);
router.post("/food", CommonAuth_1.Authenticate, images, index_1.AddFood);
router.get("/foods", CommonAuth_1.Authenticate, index_1.GetFoods);
//# sourceMappingURL=VendorRoute.js.map