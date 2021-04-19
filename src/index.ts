"use strict";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Pool from "pg-pool";
import { ResponseGenerator } from "./helpers/responseGenerator";
import Config from "./database/config/config";
import Routes from "./routes/v1";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = new Pool();
const dbSocketAddr = process.env.DB_HOST?.split(":");

let dbPort = Number(process.env.DB_PORT) || 5432;

if (dbSocketAddr && dbSocketAddr?.length > 1) {
    dbPort = Number(dbSocketAddr[1]);
}

// const { development, production, test } = Config;

const pool2 = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: (dbSocketAddr && dbSocketAddr[0]) || process.env.BD_HOST || "db",
    port: dbPort,
    ssl: true,
    max: 20,
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
});

Routes(app);

app.use("*", (req, res) => {
    ResponseGenerator.sendError(res, 404, "Page Not Found");
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    process.stdout.write(`Listening on port ${PORT}`);
});

export default app;
