import { Router } from "express";
import { ConversionMiddleware } from "./index.middleware";

const router = Router();

// const uploadMiddleWare = new ConversionMiddleware();

console.log("==========================================");

router.post("/upload", ConversionMiddleware.uploadHandler);

export default router;
