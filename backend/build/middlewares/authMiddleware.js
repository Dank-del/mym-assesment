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
const zod_1 = require("zod");
const express_zod_api_1 = require("express-zod-api");
const user_1 = require("../model/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (0, express_zod_api_1.createMiddleware)({
    security: {
        // this information is optional and used for the generated documentation (OpenAPI)
        and: [
            { type: "input", name: "token" },
            // { type: "header", name: "token" },
        ],
    },
    input: zod_1.z.object({
        token: zod_1.z.string().min(1),
    }),
    middleware: ({ input: { token }, request, response, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        logger.debug("Checking the key and token");
        let user;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userQuery = yield user_1.User.findOne({ _id: decoded.id });
            user = userQuery === null || userQuery === void 0 ? void 0 : userQuery.toJSON();
            logger.debug(user);
        }
        catch (error) {
            throw (0, express_zod_api_1.createHttpError)(401, String(error));
        }
        if (!user) {
            throw (0, express_zod_api_1.createHttpError)(401, "unauthorized");
        }
        return { user }; // provides endpoints with options.user
    }),
});
exports.default = authMiddleware;
