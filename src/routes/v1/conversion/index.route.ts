import { Router } from "express";
import { ConversionMiddleware } from "./index.middleware";
import { ConversionController } from "../../../controllers/conversion";
import multer from "multer";

const router = Router();

router.post(
    "/upload",
    ConversionMiddleware.uploadFile("convertFile"),
    ConversionController.uploadFile,
);

router.get("convert/:target/:id", ConversionMiddleware.chooseTarget);

export default router;
