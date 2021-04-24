import { Request, Response } from "express";
import { ResponseGenerator } from "../../helpers/responseGenerator";
import { BaseRepository } from "../../baseRepository";
import { ConversionMiddleware } from "../../middlewares/conversion";
import { AmazonS3 } from "../../helpers/awsS3";
import Upload from "../../database/models/upload";

export class ConversionController extends ResponseGenerator {
    constructor() {
        super();
    }

    static CALL_INTERVAL = 3000;

    static async uploadFile(req: Request, res: Response) {
        const { originalname } = req.file;

        const name = originalname.split(".");
        name.pop();
        const thename = name.join(".");

        try {
            const response = await BaseRepository.create(Upload, {
                fileUrl: req.bucketUrl,
                fileName: thename,
            });

            const { fileId, fileName } = await response.get({
                plain: true,
            });

            return ResponseGenerator.sendSuccess(res, 200, {
                message: "File Upload Success",
                fileId,
                fileName,
            });
        } catch (error) {
            return ResponseGenerator.sendError(res, 400, error.message);
        }
    }

    static async setConvertTarget(req: Request, res: Response) {
        try {
            const { id, target } = req.params;

            const response = await BaseRepository.findAndUpdate(
                Upload,
                { target },
                { fileId: id },
            );

            const {
                fileName,
                target: targetFormat,
                fileId,
                id: rowId,
            } = response[1].dataValues;

            return ResponseGenerator.sendSuccess(res, 200, {
                targetName: `${fileName}-${rowId}.${targetFormat.toLowerCase()}`,
                fileId,
            });
        } catch (error) {
            return ResponseGenerator.sendError(
                res,
                500,
                "Internal Server Error",
            );
        }
    }

    static async streamConversion(req: Request, res: Response) {
        const { id: fileId } = req.params;

        try {
            const getInfo = await BaseRepository.findOneByField(Upload, {
                fileId,
            });

            const { fileName, target, id } = getInfo;

            const bucketService = new AmazonS3();

            const targetName = `${fileName}-${id}.${target}`;

            const fileContent = "If you ever need a reason to smile...";

            const bucketUrl = await bucketService.uploadConverted(
                fileContent,
                targetName,
            );

            if (!bucketUrl) {
                throw "";
            }

            ConversionMiddleware.convertFile(req, res);

            await BaseRepository.findAndUpdate(
                Upload,
                { targetUrl: bucketUrl },
                { fileId },
            );
        } catch (error) {
            return ResponseGenerator.sendError(
                res,
                500,
                "Internal Server Error",
            );
        }
    }

    static async downloadFile(req: Request, res: Response) {
        try {
            const response = await BaseRepository.findOneByField(Upload, {
                fileId: req.params.id,
            });

            const { targetUrl } = response.dataValues;

            return ResponseGenerator.sendSuccess(res, 200, {
                convertedFile: targetUrl,
            });
        } catch (error) {
            return ResponseGenerator.sendError(
                res,
                500,
                "Internal Server Error",
            );
        }
    }
}
