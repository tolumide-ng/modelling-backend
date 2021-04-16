import { Request, Response, NextFunction } from "express";
import { ResponseGenerator } from "../../../helpers/responseGenerator";
import multer, { FileFilterCallback } from "multer";

export class ConversionMiddleware extends ResponseGenerator {
    static mimeTypes = ["application/shapr", "image/shapr", "text/shapr"];

    static maxSize = 10 * 1024 * 1024;

    static convertTargets = ["step", "stl", "iges"];

    static multer = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: ConversionMiddleware.maxSize, // accept files not larger than 10mb
        },
    });

    static testMulter = multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, "/desktop/uploads");
        },

        filename: (_req, file, cb) => {
            cb(null, file.filename + "--" + Date.now());
        },
    });

    static async uploadHandler(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const filterHandler = (
            request: Request,
            file: any,
            cb: FileFilterCallback,
        ) => {
            if (this.mimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                ResponseGenerator.sendError(
                    res,
                    415,
                    "Unsupported Media Type, Only .shapr files are allowed",
                );
            }

            // validate filesize also by checking what the value of console.log is

            console.log(file);
        };

        const upload = multer({
            storage: ConversionMiddleware.testMulter,
            limits: {
                fileSize: ConversionMiddleware.maxSize,
            },
            fileFilter: filterHandler,
        }).single("file");

        // AFTER THE UPLOAD VALIDATION, UPLOAD THE FILE TO CLOUD BUCKET
        // ATTACH THE BUCKET URL TO REQ.BUCKETURL
        // CALL NEXT

        // req.bucketUrl = "urlWhereImageIsStored";

        next();
    }

    static async validateConvertRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        if (!this.convertTargets.includes(req.params.target)) {
            return this.sendError(res, 415, "Usupported Media Target");
        }

        next();
    }
}
