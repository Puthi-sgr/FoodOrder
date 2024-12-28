"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../routes/index");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const ErrorHandler_1 = __importDefault(require("../middlewares/ErrorHandler"));
const cors_1 = __importDefault(require("cors"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    //middlewares
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)({
        origin: "http://localhost:3001", // Allow requests from this origin
    }));
    //multer image storage
    app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
    //error handling middleware
    app.use(ErrorHandler_1.default);
    //routes
    app.use("/admin", index_1.AdminRoute);
    app.use("/vendor", index_1.VendorRoute);
    app.use("/shopping", index_1.ShoppingRoute);
    app.use("/customer", index_1.CustomerRoute);
    return app;
});
//# sourceMappingURL=ExpressApp.js.map