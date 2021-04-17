import { ResponseGenerator } from "../../../helpers/responseGenerator";
import multer from "multer";
import { validateReceivedFile } from "./index.validator";

export class ConversionMiddleware {
    static MAX_FILE_SIZE = 5 * 1024 * 1024;

    static mimeTypes = ["application/shapr", "image/shapr", "text/shapr"];

    static uploadFile(file: string) {
        const multerUpload = multer({
            limits: { fileSize: this.MAX_FILE_SIZE, files: 1 },
        }).single(file);

        return ResponseGenerator.composeHanlders(
            multerUpload,
            validateReceivedFile,
        );
    }
}
