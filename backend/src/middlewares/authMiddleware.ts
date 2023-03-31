import { z } from "zod";
import { createMiddleware, createHttpError } from "express-zod-api";
import {IUser, User} from "../model/user";
import jwt, {JwtPayload} from "jsonwebtoken";
import {Document} from "mongoose";

const authMiddleware = createMiddleware({
    security: {
        // this information is optional and used for the generated documentation (OpenAPI)
        and: [
            { type: "input", name: "token" },
            // { type: "header", name: "token" },
        ],
    },
    input: z.object({
        token: z.string().min(1),
    }),
    middleware: async ({ input: { token }, request, response, logger }) => {
        logger.debug("Checking the key and token");
        let user: any;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            const userQuery = await User.findOne({ _id: (decoded as JwtPayload).id });
            user = userQuery?.toJSON()
            logger.debug(user);
        } catch (error) {
            throw createHttpError(401, String(error));
        }
        if (!user) {
            throw createHttpError(401, "unauthorized");
        }

        return { user }; // provides endpoints with options.user
    },
});

export default authMiddleware;