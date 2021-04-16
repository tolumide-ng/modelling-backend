import conversionRoutes from "./conversion/index.route";
import express from "express";

export default (app: express.Application) => {
    console.log("TALKING FIRST");
    app.use("/", conversionRoutes);
};
