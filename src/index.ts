"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ResponseGenerator } from "./helpers/responseGenerator";
import Routes from "./routes/v1";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

Routes(app);

app.use("*", (req, res) => {
    ResponseGenerator.sendError(res, 404, "Page Not Found");
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    process.stdout.write(`Listening on port ${PORT}`);
});

export default app;
