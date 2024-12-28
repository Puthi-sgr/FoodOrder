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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_1 = require("../config/index");
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //data base connection
        yield mongoose_1.default
            .connect(index_1.MONGO_URI, {
            serverSelectionTimeoutMS: 100000, // Increase timeout to 20 seconds
        })
            .then((res) => console.log("Database connected"))
            .catch((err) => console.log("Error: ", err));
    }
    catch (ex) {
        console.log(ex.message);
    }
});
//# sourceMappingURL=Database.js.map