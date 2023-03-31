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
const express_zod_api_1 = require("express-zod-api");
const zod_1 = require("zod");
const user_1 = require("../model/user");
const pwd_1 = require("../utils/pwd");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const signUpEndPoint = express_zod_api_1.defaultEndpointsFactory.build({
    method: "post",
    input: zod_1.z.object({
        // for empty input use z.object({})
        name: zod_1.z.string().max(50),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().max(20)
    }),
    output: zod_1.z.object({
        message: zod_1.z.string().optional(),
        user: zod_1.z.any().optional()
    }),
    handler: ({ input: { name, email, password }, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        // logger.debug("Options:", options); // middlewares provide options
        const existingUser = yield user_1.User.findOne({
            email: email
        });
        if (existingUser) {
            throw (0, express_zod_api_1.createHttpError)(401, "user exists with same email");
        }
        const hashedPwd = yield (0, pwd_1.hashIt)(password);
        const user = new user_1.User({
            fullName: name,
            email: email,
            password: hashedPwd
        });
        const savedUser = yield user.save();
        return { message: "user created successfully", user: savedUser };
    }),
});
const getMeEndpoint = express_zod_api_1.defaultEndpointsFactory
    .addMiddleware(authMiddleware_1.default)
    .build({
    input: zod_1.z.object({}),
    output: zod_1.z.object({
        user: zod_1.z.any()
    }),
    method: "get",
    handler: ({ options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            "user": options.user
        };
    })
});
const signInEndpoint = express_zod_api_1.defaultEndpointsFactory.build({
    method: "post",
    input: zod_1.z.object({
        // for empty input use z.object({})
        email: zod_1.z.string().email(),
        password: zod_1.z.string().max(20)
    }),
    output: zod_1.z.object({
        message: zod_1.z.string().optional(),
        token: zod_1.z.string().optional()
    }),
    handler: ({ input: { email, password }, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        // logger.debug("Options:", options); // middlewares provide options
        const existingUser = yield user_1.User.findOne({
            email: email
        });
        if (!existingUser) {
            throw (0, express_zod_api_1.createHttpError)(401, "invalid email");
        }
        const isPwdMatch = yield (0, bcrypt_1.compare)(password, existingUser.password);
        if (!isPwdMatch) {
            throw (0, express_zod_api_1.createHttpError)(401, "wrong password");
        }
        // @ts-ignore
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return { message: "logged in successfully", token: token };
    }),
});
const route = {
    signup: signUpEndPoint,
    signin: signInEndpoint,
    me: getMeEndpoint
};
exports.default = route;
