"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", function (req, res) {
    // console.log("the full request", req);
    res.json({ message: "Hllo world" });
});

app.listen(300);

app.use("*", (req, res) => {
    res.status(404).json({
        message: "Page Not Found",
    });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    process.stdout.write(`Listening on port ${PORT}`);
});

export default app;
