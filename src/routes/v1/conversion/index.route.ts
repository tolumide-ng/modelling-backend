import { Router } from "express";
import { ConversionMiddleware, isIdValid } from ".";
import { ConversionController } from "../../../controllers/conversion";

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

router.get("/stream/:id", isIdValid, ConversionController.streamConversion);

router.get("/download/:id", isIdValid, ConversionController.downloadFile);

export default router;
