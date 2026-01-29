// setting up express

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}))

if (!process.env.CORS_ORIGIN) {
  throw new Error("CORS_ORIGIN is not defined");
}


app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(cookieParser())


//User router

import userRouter from "./routes/user.routes.js"

app.use("/users", userRouter);

//Note router

import noteRouter from "./routes/note.routes.js"

app.use("/notes", noteRouter);


export default app;