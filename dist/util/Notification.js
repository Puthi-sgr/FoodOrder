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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnRequestOTP = exports.GenerateOTP = void 0;
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000); //30 minutes from now
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const OnRequestOTP = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    try {
        const response = client.messages
            .create({
            body: `This is your otp code ${otp}`,
            from: "+17754874987",
            to: to,
            //096 9764313
            // +855 95 978 626
        })
            .then((message) => console.log(message.sid));
        return response;
    }
    catch (error) {
        console.log("On request error: ", error);
    }
});
exports.OnRequestOTP = OnRequestOTP;
//# sourceMappingURL=Notification.js.map