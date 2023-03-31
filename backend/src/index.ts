import {createConfig, createServer, Routing} from "express-zod-api";
import userRoute from './routes/user';
import connectDb from "./utils/connectDb";
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();
const config = createConfig({
    server: {
        listen: 8090, // port or socket
    },
    startupLogo: false,
    cors: ({ defaultHeaders, request, endpoint, logger }) => ({
        ...defaultHeaders,
        "Access-Control-Max-Age": "5000",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE"
    }),
    logger: {
        level: "debug",
        color: true,
    },
});

const routing: Routing = {
    v1: {
        user: userRoute,
    },
};

connectDb().then(() => winston.debug("Connected to MongoDB")).catch((err) => winston.error(err))
createServer(config, routing);



