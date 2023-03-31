import {createHttpError, defaultEndpointsFactory} from "express-zod-api";
import {z} from "zod";
import {User} from "../model/user";
import {hashIt} from "../utils/pwd";
import jwt from 'jsonwebtoken';
import {compare} from "bcrypt";
import authMiddleware from "../middlewares/authMiddleware";


const signUpEndPoint = defaultEndpointsFactory.build({
    method: "post",
    input: z.object({
        // for empty input use z.object({})
        name: z.string().max(50),
        email: z.string().email(),
        password: z.string().max(20)
    }),
    output: z.object({
        message: z.string().optional(),
        user: z.any().optional()
    }),
    handler: async ({input: {name, email, password}, options, logger}) => {
        // logger.debug("Options:", options); // middlewares provide options
        const existingUser = await User.findOne({
            email: email
        })
        if (existingUser) {
            throw createHttpError(401, "user exists with same email")
        }
        const hashedPwd = await hashIt(password);
        const user = new User({
            fullName: name,
            email: email,
            password: hashedPwd
        })
        const savedUser = await user.save();
        return {message: "user created successfully", user: savedUser};
    },
});

const getMeEndpoint = defaultEndpointsFactory
    .addMiddleware(authMiddleware)
    .build({
    input: z.object({}),
    output: z.object({
        user: z.any()
    }),
    method: "get",
    handler: async ({ options, logger}) => {
        return {
            "user": options.user
        }
    }
})

const signInEndpoint = defaultEndpointsFactory.build({
        method: "post",
        input: z.object({
            // for empty input use z.object({})
            email: z.string().email(),
            password: z.string().max(20)
        }),
        output: z.object({
            message: z.string().optional(),
            token: z.string().optional()
        }),
        handler: async ({input: {email, password}, options, logger}) => {
            // logger.debug("Options:", options); // middlewares provide options
            const existingUser = await User.findOne({
                email: email
            })
            if (!existingUser) {
                throw createHttpError(401, "invalid email")
            }
            const isPwdMatch = await compare(password, existingUser.password)
            if (!isPwdMatch) {
                throw createHttpError(401, "wrong password")
            }

            // @ts-ignore
            const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET as string, {
                expiresIn: "1d",
            });

            return {message: "logged in successfully", token: token};
        },
    });


const route = {
    signup: signUpEndPoint,
    signin: signInEndpoint,
    me: getMeEndpoint
}

export default route;