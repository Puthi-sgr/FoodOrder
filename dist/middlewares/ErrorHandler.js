"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const errorHandler = (err, req, res, next) => {
    var _a;
    const statusCode = (_a = res.statusCode) !== null && _a !== void 0 ? _a : 500;
    //if the status code exist, use  Res.status code;
    switch (statusCode) {
        case Constants_1.constants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack,
            });
        case Constants_1.constants.UNAUTHORIZED:
            res.json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack,
            });
        case Constants_1.constants.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack,
            });
        case Constants_1.constants.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrace: err.stack,
            });
        case Constants_1.constants.VALIDATION_ERROR:
            res.json({
                title: "Validation error",
                message: err.message,
                stackTrace: err.stack,
            });
        default:
            console.log("No errors has been found");
    }
};
exports.default = errorHandler;
//# sourceMappingURL=ErrorHandler.js.map