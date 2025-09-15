import cors from "cors"
import express, { Request, Response } from 'express';

import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
// import "./app/config/passport"
import { envVars } from "./app/config/env";
import { router } from "./app/routers";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app = express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy",1)
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())



app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to the tour management system"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app