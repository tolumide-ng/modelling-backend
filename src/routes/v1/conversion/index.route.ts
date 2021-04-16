import { Router } from "express";
import { ConversionMiddleware } from "./index.middleware";
import { ConversionController } from "../../../controllers/conversion";

const router = Router();

router.post(
    "/upload",
    ConversionMiddleware.uploadHandler,
    ConversionController.uploadFile,
);

export default router;
