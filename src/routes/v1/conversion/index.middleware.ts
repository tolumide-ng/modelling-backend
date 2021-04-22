import { ResponseGenerator } from "../../../helpers/responseGenerator";
import multer from "multer";
import { validateReceivedFile } from "./index.validator";
import { isIdPresent, isIdValid, isValidTarget } from ".";
import { AmazonS3 } from "../../../helpers/awsS3/index.awsS3";

export class ConversionMiddleware {
    static MAX_FILE_SIZE = 5 * 1024 * 1024;

    static mimeTypes = ["application/shapr", "image/shapr", "text/shapr"];

    static uploadFile(file: string) {
        const multerUpload = multer({
            limits: { fileSize: this.MAX_FILE_SIZE, files: 1 },
        }).single(file);

        const awsS3 = new AmazonS3();

        return ResponseGenerator.composeHanlders(
            multerUpload,
            validateReceivedFile,
            (req, res, next) => {
                awsS3.uploadOriginal(req, res, next);
            },
        );
    }

    static chooseTarget() {
        return ResponseGenerator.composeHanlders(
            isIdPresent,
            isIdValid,
            isValidTarget,
        );
    }
}
