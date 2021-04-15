import { Router } from "express";
import { ConversionMiddleware } from "./index.middleware";

const router = Router();

// const uploadMiddleWare = new ConversionMiddleware();

router.post("/", ConversionMiddleware.uploadHandler);

export default router;
