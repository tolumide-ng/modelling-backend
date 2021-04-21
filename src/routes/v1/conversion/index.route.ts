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

router.patch(
    "/convert/:target/:id",
    ConversionMiddleware.chooseTarget(),
    ConversionController.setConvertTarget,
);

router.get("/stream/:id", ConversionController.streamConversion);

export default router;
