"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";
import { ResponseGenerator } from "./helpers/responseGenerator";
import Routes from "./routes/v1";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const dbSocketAddr = process.env.DB_HOST?.split(":");

let dbPort = Number(process.env.DB_PORT) || 5432;

if (dbSocketAddr && dbSocketAddr?.length > 1) {
    dbPort = Number(dbSocketAddr[1]);
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();

Routes(app);

app.use("*", (req, res) => {
    ResponseGenerator.sendError(res, 404, "Page Not Found");
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    process.stdout.write(`Listening on port ${PORT}`);
});

export default app;
