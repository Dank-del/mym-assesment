"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_zod_api_1 = require("express-zod-api");
const user_1 = __importDefault(require("./routes/user"));
const connectDb_1 = __importDefault(require("./utils/connectDb"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = (0, express_zod_api_1.createConfig)({
    server: {
        listen: 8090, // port or socket
    },
    startupLogo: false,
    cors: ({ defaultHeaders, request, endpoint, logger }) => (Object.assign(Object.assign({}, defaultHeaders), { "Access-Control-Max-Age": "5000", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With", "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE" })),
    logger: {
        level: "debug",
        color: true,
    },
});
const routing = {
    v1: {
        user: user_1.default,
    },
};
(0, connectDb_1.default)().then(() => winston_1.default.debug("Connected to MongoDB")).catch((err) => winston_1.default.error(err));
(0, express_zod_api_1.createServer)(config, routing);
