import conversionRoutes from "./conversion/index.route";
import express from "express";

export default (app: express.Application) => {
    app.use("/", conversionRoutes);
};
