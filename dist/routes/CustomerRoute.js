"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const CommonAuth_1 = require("../middlewares/CommonAuth");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.post("/signup", controllers_1.SignUp);
router.post("/signin", controllers_1.SignIn);
//--------- Authenticate ---------------
router.post("/verify", CommonAuth_1.Authenticate, controllers_1.Verify);
router.get("/otp", CommonAuth_1.Authenticate, controllers_1.sendOtp);
router.get("/profile", CommonAuth_1.Authenticate, controllers_1.GetCustomerProfile);
router.patch("/edit", CommonAuth_1.Authenticate, controllers_1.EditCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map