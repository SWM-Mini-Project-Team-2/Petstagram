import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import userRouter from "./router/user.js";
import postRouter from "./router/post.js";

const port = 8000;
const __dirname = path.resolve();

var app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        // origin: ["http://localhost:3000", "http://localhost:5500"],
        origin: true,
        credentials: true,
    })
);

app.use("/user", userRouter);
app.use("/post", postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
